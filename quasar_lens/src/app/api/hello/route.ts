// src/app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Hello World! This is a GET request",
    method: "GET",
    timestamp: new Date().toISOString(),
  });
}
