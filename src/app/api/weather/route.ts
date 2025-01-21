import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const baseDate = searchParams.get("baseDate");
  const baseTime = searchParams.get("baseTime");
  const nx = searchParams.get("nx"); // 지역 nx 값
  const ny = searchParams.get("ny"); // 지역 ny 값

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL;

  if (!apiKey || !apiUrl) {
    console.error("API Key or API URL is missing");
    return NextResponse.json(
      { error: "API Key or API URL is missing" },
      { status: 500 }
    );
  }

  // 수정된 URL
  const url = `${apiUrl}?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  console.log("Request URL:", url); // 디버깅용 로그

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error Response:", await response.text());
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
