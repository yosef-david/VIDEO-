export type VideoDuration = 1 | 5 | 10 | 30 | 60 | 120;
export type Quality = "720p" | "1080p" | "4K";
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "21:9";
export type VideoStyle =
  | "realistic"
  | "cinematic"
  | "3d-animation"
  | "anime"
  | "documentary"
  | "presentation"
  | "ad"
  | "illustration"
  | "freeform";

export type Scene = {
  id: string;
  title: string;
  description: string;
  duration: number;
};

export type ProjectStatus = "draft" | "queued" | "rendering" | "ready" | "failed";

export type VideoProject = {
  id: string;
  name: string;
  prompt: string;
  duration: VideoDuration;
  style: VideoStyle | string;
  language: string;
  narrationLanguage: string;
  voice: string;
  soundtrack: string;
  closedCaptions: boolean;
  onScreenTitles: boolean;
  pacing: "slow" | "balanced" | "fast";
  quality: Quality;
  aspectRatio: AspectRatio;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
  outputUrl?: string;
  subtitleUrl?: string;
  narrationUrl?: string;
};

export type GenerationRequest = {
  name?: string;
  prompt: string;
  duration: VideoDuration;
  style: VideoStyle | string;
  language: string;
  narrationLanguage: string;
  voice: string;
  soundtrack: string;
  closedCaptions: boolean;
  onScreenTitles: boolean;
  pacing: "slow" | "balanced" | "fast";
  quality: Quality;
  aspectRatio: AspectRatio;
};
