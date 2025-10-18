const VideoPage = async ({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) => {
  const { videoId } = await params;
  return (
    <div>
      <h1>Video Page</h1>
      <p>Video ID: {videoId}</p>
    </div>
  );
};

export default VideoPage;
