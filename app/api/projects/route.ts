import { NextRequest, NextResponse } from "next/server";
import { createProject, listProjects, projectStorePath } from "@/lib/store";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const name = payload.name || "פרויקט חדש";
  const project = await createProject({
    name,
    prompt: payload.prompt || "",
    duration: Number(payload.duration || 5),
    style: payload.style || "cinematic",
    language: payload.language || "he",
    narrationLanguage: payload.narrationLanguage || "he",
    voice: payload.voice || "female-professional",
    soundtrack: payload.soundtrack || "cinematic-orchestral",
    closedCaptions: Boolean(payload.closedCaptions),
    onScreenTitles: Boolean(payload.onScreenTitles),
    pacing: payload.pacing || "balanced",
    quality: payload.quality || "1080p",
    aspectRatio: payload.aspectRatio || "16:9",
    status: "draft",
    scenes: payload.scenes || [
      { id: crypto.randomUUID(), title: "פתיחה", description: "הצגת הנושא הראשוני", duration: 20 },
      { id: crypto.randomUUID(), title: "פיתוח", description: "הרחבת הרעיון המרכזי", duration: 40 },
      { id: crypto.randomUUID(), title: "סיום", description: "שיא והצעות לפעולה", duration: 20 }
    ]
  });

  return NextResponse.json({ ok: true, project, storage: projectStorePath });
}
