import { z } from "zod";

export const SceneSchema = z.object({
  type: z.enum(["text", "image-text"]),
  text: z.string(),
  imageUrl: z.string().optional(),
  duration: z.number().min(1.5).max(30), // Adjusted based on latest prompt rules
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
