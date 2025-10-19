import { NextRequest, NextResponse } from "next/server";
import data from "@/lib/data/data.json";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";

    // Filter videos based on search query
    const filteredVideos = data.items.filter((item) => {
      if (!query) return true;

      const title = item.snippet.title.toLowerCase();
      const description = item.snippet.description.toLowerCase();
      const searchTerm = query.toLowerCase();

      return title.includes(searchTerm) || description.includes(searchTerm);
    });

    // Calculate pagination
    const totalVideos = filteredVideos.length;
    const totalPages = Math.ceil(totalVideos / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated videos
    const videos = filteredVideos.slice(startIndex, endIndex);

    return NextResponse.json({
      videos,
      pagination: {
        currentPage: page,
        totalPages,
        totalVideos,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
