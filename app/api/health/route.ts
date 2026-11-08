import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    ok: true,
    service: "videomind-ai",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
