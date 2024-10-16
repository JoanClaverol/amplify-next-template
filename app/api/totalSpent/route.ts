import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "http://localhost:4000/data";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch data from ${API_BASE_URL}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data", error: (error as Error).message },
      { status: 500 }
    );
  }
}
