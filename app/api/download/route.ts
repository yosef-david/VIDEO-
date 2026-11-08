import { NextRequest, NextResponse } from "next/server";
import { createProject, listProjects, updateProjectById } from "@/lib/store";
import { getAiConfig, maybeGenerateProjectPlan } from "@/lib/pipeline";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const aiConfig = getAiConfig();

  if (!aiConfig.enabled) {
    return NextResponse.json(
      {
        ok: false,
        status: "needs_configuration",
        message:
          "לא הוגדר מנוע AI. הוסף משתני סביבה כמו VIDEOMIND_API_KEY ו-VIDEOMIND_PROVIDER כדי להתחבר לספק וידאו אמיתי.",
      },
      { status: 503 }
    );
  }

  const project = await createProject({
    name: body.name || "פרויקט חדש",
    prompt: body.prompt || "",
    duration: Number(body.duration || 5),
    style: body.style || "cinematic",
    language: body.language || "he",
    narrationLanguage: body.narrationLanguage || "he",
    voice: body.voice || "female-professional",
    soundtrack: body.soundtrack || "cinematic-orchestral",
    closedCaptions: Boolean(body.closedCaptions),
    onScreenTitles: Boolean(body.onScreenTitles),
    pacing: body.pacing || "balanced",
    quality: body.quality || "1080p",
    aspectRatio: body.aspectRatio || "16:9",
    status: "queued",
    scenes: maybeGenerateProjectPlan(body.prompt || "", Number(body.duration || 5), body.style || "cinematic"),
  });

  await updateProjectById(project.id, {
    status: "rendering",
    updatedAt: new Date().toISOString(),
  });

  const projects = await listProjects();

  return NextResponse.json({
    ok: true,
    project,
    projects,
    status: "rendering",
    message: "The project has been accepted by the AI pipeline. Real rendering will start only after the provider configuration is active.",
  });
}
