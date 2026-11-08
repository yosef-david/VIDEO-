import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const projectId = search.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { ok: false, message: "No project id supplied" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: false,
    message: "No final rendered MP4 asset exists yet. Connect a real video provider and render the project to produce a downloadable file.",
    projectId,
  }, { status: 404 });
}
