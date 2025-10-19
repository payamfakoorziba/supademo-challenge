"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer = ({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) => {
  const [player, setPlayer] = useState<any>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const initializePlayer = useCallback(() => {
    if (videoRef.current && typeof window.YT !== "undefined") {
      // Destroy existing player if it exists
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      const ytPlayer = new window.YT.Player(videoRef.current, {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          controls: 0,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
        },
      });

      playerRef.current = ytPlayer;
      setPlayer(ytPlayer);
    }
  }, [videoId]);

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (typeof window.YT === "undefined") {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initializePlayer]);

  const toggleVideo = () => {
    if (isPlaying) {
      setIsPlaying(false);
      player?.pauseVideo();
    } else {
      setIsPlaying(true);
      player?.playVideo();
    }
  };

  return (
    <div>
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <div ref={videoRef} />
      </div>

      <div className="mt-10">
        <button onClick={toggleVideo}>
          {isPlaying ? (
            <PauseIcon className="size-6" />
          ) : (
            <PlayIcon className="size-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
