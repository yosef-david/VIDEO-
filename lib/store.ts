export type ProviderConfig = {
  enabled: boolean;
  provider: string;
  apiKey?: string;
  model?: string;
  apiUrl?: string;
};

export function getAiConfig(): ProviderConfig {
  const provider = process.env.VIDEOMIND_PROVIDER || "none";
  const apiKey = process.env.VIDEOMIND_API_KEY || "";
  const model = process.env.VIDEOMIND_MODEL || "";
  const apiUrl = process.env.VIDEOMIND_API_URL || "";

  return {
    enabled: provider !== "none" && Boolean(apiKey),
    provider,
    apiKey,
    model,
    apiUrl,
  };
}

export function maybeGenerateProjectPlan(prompt: string, duration: number, style: string) {
  const scenes = Math.max(3, Math.min(8, Math.ceil(duration / 10)));
  const generated = Array.from({ length: scenes }, (_, index) => ({
    id: `scene-${Date.now()}-${index}`,
    title: `${index + 1}. ${style} scene`,
    description: prompt || "Scene description generated from user input",
    duration: Math.max(10, Math.round(duration / scenes)),
  }));

  return generated;
}
