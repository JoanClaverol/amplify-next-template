import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/constants/apiConfig";

export async function GET(req: NextRequest) {
  try {
    // Extract the 'company_name' query parameter from the request
    const { searchParams } = new URL(req.url);
    const companyName = searchParams.get("company_name");

    // Check if company name is provided
    if (!companyName) {
      return NextResponse.json(
        { message: "Company name is required" },
        { status: 400 }
      );
    }
    // Build the URL with the encoded company name
    const apiUrl = `${API_URL}/get-advertising-info?company_name=${companyName}`;

    // Fetch the data from the external API
    const response = await fetch(apiUrl);

    // Check for a failed response
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${apiUrl}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the fetched data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data", error: (error as Error).message },
      { status: 500 }
    );
  }
}
