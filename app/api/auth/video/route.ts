import { connectToDB } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET() {
  try {
    await connectToDB();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDB();
    const body: IVideo = await req.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const videoData: IVideo = {
      ...body,
      controls: body.controls !== undefined ? body.controls : true,
      transformation: {
        height: body.transformation?.height || 1080,
        width: body.transformation?.width || 1920,
        quality: body.transformation?.quality || 100,
      },
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.log("Error Uploading Video..... ::: "+error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 },
    );
  }
}
