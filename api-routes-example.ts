// app/api/render/route.ts
// Main render endpoint for queuing video renders

import { NextRequest, NextResponse } from 'next/server';
import { renderMediaOnLambda } from '@remotion/lambda';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { deductCredits, hasEnoughCredits } from '@/lib/billing';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, resolution = '1080p', format = 'mp4', codec = 'h264' } = body;

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { template: true }
    });

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Calculate credits needed (based on resolution)
    const creditsNeeded = calculateCredits(resolution, project.duration);
    
    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(session.user.id, creditsNeeded);
    if (!hasCredits) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        creditsNeeded,
        creditsAvailable: await getUserCredits(session.user.id)
      }, { status: 402 });
    }

    // Create render record
    const render = await prisma.render.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
        compositionId: project.compositionId,
        inputProps: project.compositionData,
        resolution,
        format,
        codec,
        status: 'QUEUED',
        creditsUsed: creditsNeeded
      }
    });

    // Deduct credits immediately
    await deductCredits(session.user.id, creditsNeeded);

    // Queue render on Remotion Lambda
    try {
      const { renderId, bucketName } = await renderMediaOnLambda({
        region: process.env.AWS_REGION!,
        functionName: process.env.REMOTION_LAMBDA_FUNCTION!,
        composition: project.compositionId,
        serveUrl: process.env.REMOTION_SERVE_URL!,
        codec: codec as any,
        inputProps: project.compositionData as any,
        privacy: 'private',
        outName: `${render.id}.${format}`,
        imageFormat: 'jpeg',
        jpegQuality: 90,
        webhook: {
          url: `${process.env.APP_URL}/api/webhooks/render`,
          secret: process.env.WEBHOOK_SECRET!,
        }
      });

      // Update render with remote ID
      await prisma.render.update({
        where: { id: render.id },
        data: {
          remoteRenderId: renderId,
          status: 'PROCESSING',
          startedAt: new Date()
        }
      });

      return NextResponse.json({
        renderId: render.id,
        status: 'PROCESSING',
        message: 'Render queued successfully'
      });

    } catch (error) {
      // Refund credits if render failed to start
      await refundCredits(session.user.id, creditsNeeded);
      
      await prisma.render.update({
        where: { id: render.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }

  } catch (error) {
    console.error('Render error:', error);
    return NextResponse.json(
      { error: 'Failed to queue render' },
      { status: 500 }
    );
  }
}

// Get render status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get('renderId');

    if (!renderId) {
      // List all renders for user
      const renders = await prisma.render.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          project: {
            select: { name: true, compositionId: true }
          }
        }
      });

      return NextResponse.json({ renders });
    }

    // Get specific render
    const render = await prisma.render.findUnique({
      where: { id: renderId },
      include: {
        project: {
          select: { name: true }
        }
      }
    });

    if (!render || render.userId !== session.user.id) {
      return NextResponse.json({ error: 'Render not found' }, { status: 404 });
    }

    return NextResponse.json({ render });

  } catch (error) {
    console.error('Get render error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch render' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateCredits(resolution: string, durationInFrames?: number): number {
  const baseCredits = {
    '720p': 1,
    '1080p': 2,
    '4K': 5
  }[resolution] || 2;

  // Additional credit per 10 seconds of video
  const duration = (durationInFrames || 300) / 30; // Convert to seconds
  const durationMultiplier = Math.ceil(duration / 10);

  return baseCredits * durationMultiplier;
}

async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true }
  });
  return user?.creditsRemaining || 0;
}

// ============================================
// app/api/webhooks/render/route.ts
// Webhook handler for render completion

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhooks';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-remotion-signature');
    const body = await request.text();

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET!);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { type, renderId, outputUrl, outputSize } = payload;

    // Find our render record by remote ID
    const render = await prisma.render.findFirst({
      where: { remoteRenderId: renderId }
    });

    if (!render) {
      console.error('Render not found:', renderId);
      return NextResponse.json({ error: 'Render not found' }, { status: 404 });
    }

    if (type === 'render-success') {
      // Update render as completed
      await prisma.render.update({
        where: { id: render.id },
        data: {
          status: 'COMPLETED',
          progress: 100,
          outputUrl,
          outputSize,
          completedAt: new Date()
        }
      });

      // Track usage
      await trackRenderUsage(render.userId, true);

      // Send notification (email, push, etc.)
      await sendRenderCompleteNotification(render.id);

    } else if (type === 'render-error') {
      // Update render as failed
      await prisma.render.update({
        where: { id: render.id },
        data: {
          status: 'FAILED',
          errorMessage: payload.error || 'Render failed',
          completedAt: new Date()
        }
      });

      // Track usage
      await trackRenderUsage(render.userId, false);

      // Refund credits for failed renders
      if (render.creditsUsed) {
        await refundCredits(render.userId, render.creditsUsed);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// ============================================
// app/api/projects/route.ts
// Project CRUD endpoints

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (projectId) {
      // Get specific project
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          template: true,
          renders: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!project || project.userId !== session.user.id) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      return NextResponse.json({ project });
    }

    // List all projects
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        template: {
          select: { name: true, thumbnailUrl: true }
        },
        renders: {
          where: { status: 'COMPLETED' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return NextResponse.json({ projects });

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, templateId, compositionData } = body;

    // Get template if specified
    let template;
    if (templateId) {
      template = await prisma.template.findUnique({
        where: { id: templateId }
      });

      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name,
        description,
        templateId,
        compositionId: template?.compositionId || 'custom',
        compositionData: compositionData || template?.defaultProps || {},
        duration: template?.duration,
        fps: template?.fps || 30,
        width: template?.width || 1920,
        height: template?.height || 1080,
        status: 'DRAFT'
      },
      include: {
        template: true
      }
    });

    return NextResponse.json({ project }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, name, description, compositionData, status } = body;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create version snapshot if composition data changed
    if (compositionData && JSON.stringify(compositionData) !== JSON.stringify(project.compositionData)) {
      const latestVersion = await prisma.projectVersion.findFirst({
        where: { projectId },
        orderBy: { versionNumber: 'desc' }
      });

      await prisma.projectVersion.create({
        data: {
          projectId,
          versionNumber: (latestVersion?.versionNumber || 0) + 1,
          compositionData: project.compositionData,
          createdBy: session.user.id
        }
      });
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(compositionData && { compositionData }),
        ...(status && { status })
      },
      include: {
        template: true
      }
    });

    return NextResponse.json({ project: updatedProject });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// ============================================
// app/api/templates/route.ts
// Template library endpoints

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    const where: any = { isPublic: true };
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }
    
    if (featured) {
      where.isFeatured = true;
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        creator: {
          select: { name: true, avatar: true }
        }
      }
    });

    return NextResponse.json({ templates });

  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// ============================================
// Helper functions

async function trackRenderUsage(userId: string, successful: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.renderUsage.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    create: {
      userId,
      date: today,
      rendersTotal: 1,
      rendersSuccessful: successful ? 1 : 0,
      rendersFailed: successful ? 0 : 1
    },
    update: {
      rendersTotal: { increment: 1 },
      ...(successful ? { rendersSuccessful: { increment: 1 } } : { rendersFailed: { increment: 1 } })
    }
  });
}

async function sendRenderCompleteNotification(renderId: string) {
  // Implement notification logic (email, push, etc.)
  console.log('Sending notification for render:', renderId);
}

async function refundCredits(userId: string, amount: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      creditsRemaining: { increment: amount }
    }
  });
}
