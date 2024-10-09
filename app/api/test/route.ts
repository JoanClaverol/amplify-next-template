// app/api/test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Returning a simple JSON response
  return NextResponse.json({ message: "API is working!" });
}
