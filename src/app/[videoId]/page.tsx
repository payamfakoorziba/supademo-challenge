import data from "@/lib/data/data.json";
import VideoPlayer from "./video-player";
import { Video } from "@/lib/types";

const VideoPage = async ({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) => {
  const { videoId } = await params;

  // Find the video directly from the data
  const video = data.items.find((item) => item.id.videoId === videoId) as Video;

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <main className="p-6 flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{video.snippet.title}</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {video.snippet.description}
          </p>
        </div>
        {/* YouTube Video Embed */}
        <VideoPlayer video={video} />
      </div>
    </main>
  );
};

export default VideoPage;
