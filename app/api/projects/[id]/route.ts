import { NextRequest, NextResponse } from "next/server";
import { deleteProjectById, getProjectById, listProjects, updateProjectById } from "@/lib/store";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
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
