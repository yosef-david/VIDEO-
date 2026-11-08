import { NextRequest, NextResponse } from "next/server";
import { createProject, deleteProjectById, getProjectById, listProjects, updateProjectById } from "@/lib/store";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const sourceId = body.sourceId as string | undefined;

  if (sourceId) {
    const source = await getProjectById(sourceId);
    if (!source) {
      return NextResponse.json({ ok: false, message: "Project source not found" }, { status: 404 });
    }

    const duplicate = await createProject({
      ...source,
      id: crypto.randomUUID(),
      name: body.name || `${source.name} (העתק)`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      outputUrl: undefined,
      subtitleUrl: undefined,
      narrationUrl: undefined,
    });

    return NextResponse.json({ ok: true, project: duplicate });
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
    status: body.status || "draft",
    scenes: body.scenes || [],
  });

  return NextResponse.json({ ok: true, project });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const id = body.id;
  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing project id" }, { status: 400 });
  }

  const updated = await updateProjectById(id, body);
  return NextResponse.json({ ok: true, project: updated });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const id = body.id;
  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing project id" }, { status: 400 });
  }

  await deleteProjectById(id);
  return NextResponse.json({ ok: true, id });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const project = await getProjectById(body.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found" }, { status: 404 });
  }

  const updated = await updateProjectById(body.id, body.update);
  return NextResponse.json({ ok: true, project: updated });
}
