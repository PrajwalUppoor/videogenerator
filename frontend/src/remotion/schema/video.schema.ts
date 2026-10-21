import { z } from "zod";

export const SceneSchema = z.object({
  type: z.enum(["text", "image-text", "video-comparison"]),
  text: z.string(),
  lyrics: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl1: z.string().optional(),
  videoUrl1Offset: z.number().default(0),
  videoUrl2: z.string().optional(),
  videoUrl2Offset: z.number().default(0),
  videoUrl3: z.string().optional(),
  videoUrl3Offset: z.number().default(0),
  splitPosition: z.number().min(0).max(100).default(50),
  mode: z.enum(["split", "alternate", "interleave", "manual"]).default("split"),
  switchInterval: z.number().min(0.1).default(1),
  timeline: z.array(z.object({
    video: z.number().min(1).max(3),
    duration: z.number().min(0.1),
    offset: z.number().optional()
  })).optional(),
  videoFit: z.enum(["cover", "contain"]).default("cover"),
  duration: z.number().min(1.5).max(600),
  layout: z.enum(["standard", "full-screen"]).default("standard"),
});

export const VideoSchema = z.object({
  title: z.string(),
  fps: z.number().default(30),
  width: z.number().default(1080), // Default to 9:16 for shorts
  height: z.number().default(1920),
  scenes: z.array(SceneSchema).min(1),
  theme: z.object({
    background: z.string().default("#0f172a"),
    textColor: z.string().default("#ffffff"),
    fontFamily: z.string().default("Inter"),
  }),
  audioUrl: z.string().optional(),
  captions: z.array(z.object({
    text: z.string(),
    start: z.number(),
    end: z.number(),
  })).optional(),
});

export type VideoInput = z.infer<typeof VideoSchema>;
