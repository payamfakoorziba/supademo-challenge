import data from "@/lib/data/data.json";
import VideoPlayer from "./video-player";

const VideoPage = async ({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) => {
  const { videoId } = await params;

  // Find the video directly from the data
  const video = data.items.find((item) => item.id.videoId === videoId);

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <main className="p-6 flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-4xl">
        {/* YouTube Video Embed */}
        <VideoPlayer videoId={videoId} title={video.snippet.title} />
      </div>
    </main>
  );
};

export default VideoPage;
