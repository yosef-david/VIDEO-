import { NextRequest, NextResponse } from "next/server";
import { deleteProjectById, getProjectById, updateProjectById } from "@/lib/store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ ok: false, message: "Project not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = await updateProjectById(params.id, body);
  return NextResponse.json({ ok: true, project: updated });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await deleteProjectById(params.id);
  return NextResponse.json({ ok: true, id: params.id });
}
