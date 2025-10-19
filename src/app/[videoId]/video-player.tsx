"use client";

import { RangeSlider } from "@/components/range-slider";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import { Video } from "@/lib/types";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer = ({ video }: { video: Video }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Trim values
  const [value, setValue] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    const savedValue = localStorage.getItem(video.id.videoId);

    if (savedValue) {
      const parsedValue = JSON.parse(savedValue);
      setValue(parsedValue);
      setCurrentTime(parsedValue[0]);
    }
  }, [video]);

  const initializePlayer = useCallback(() => {
    if (videoRef.current && typeof window.YT !== "undefined") {
      // If player already exists, destroy it (for when we open a new video)
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      // Create a new player
      const ytPlayer = new window.YT.Player(videoRef.current, {
        height: "100%",
        width: "100%",
        videoId: video.id.videoId,
        playerVars: {
          controls: 0,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            const videoDuration = event.target.getDuration();
            setDuration(videoDuration);

            // Seek to the start time from localStorage after player is ready
            const savedValue = localStorage.getItem(video.id.videoId);
            if (savedValue) {
              const parsedValue = JSON.parse(savedValue);
              const startTime = (parsedValue[0] / 100) * videoDuration;
              setCurrentTime(startTime);
            }
          },
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
    }
  }, [video.id.videoId]);

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

  // Update current time periodically
  // (There's probably a better way to do this, but it works for now)
  useEffect(() => {
    if (!playerRef.current || !isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        // Check if we've reached the end of the trim range
        const endTime = (value[1] / 100) * duration;
        if (time >= endTime && duration > 0) {
          // Pause at end of trim range
          playerRef.current.pauseVideo();
          setIsPlaying(false);
          // Go back to the beginning of the trim range
          playerRef.current.seekTo((value[0] / 100) * duration);
          setCurrentTime((value[0] / 100) * duration);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, value, duration]);

  const toggleVideo = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      setIsPlaying(false);
      playerRef.current?.pauseVideo();
    } else {
      setIsPlaying(true);
      playerRef.current?.playVideo();
    }
  };

  const handleRangeChange = (newValue: [number, number]) => {
    if (!playerRef.current) return;

    setValue(newValue);
    localStorage.setItem(video.id.videoId, JSON.stringify(newValue));

    // Check if current time is outside the new range
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const startTime = (newValue[0] / 100) * duration;
      const endTime = (newValue[1] / 100) * duration;

      if (currentTime < startTime) {
        // Seek to the start of the new range
        playerRef.current.seekTo(startTime);
        setCurrentTime(startTime);
      }

      if (currentTime > endTime) {
        // Seek to the end of the new range
        playerRef.current.seekTo(endTime);
        setCurrentTime(endTime);
      }
    }
  };

  const handleCurrentTimeChange = (currentTime: number) => {
    if (!playerRef.current) return;
    setCurrentTime(currentTime);
    playerRef.current?.seekTo(currentTime);
  };

  return (
    <div>
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-neutral-100">
        <div ref={videoRef} />
      </div>

      {/* Video Controls */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-neutral-200/50 rounded-2xl backdrop-blur-sm">
          <button
            onClick={toggleVideo}
            className="flex items-center justify-center w-10 h-10 rounded-full [&_svg]:text-neutral-700 [&_svg]:hover:text-neutral-900 [&_svg]:size-4 md:[&_svg]:size-6 transition-all active:scale-90"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <RangeSlider
            min={0}
            max={100}
            step={0.01}
            value={value}
            onValueChange={handleRangeChange}
            thumbnailUrl={video.snippet.thumbnails.medium.url}
            currentTime={currentTime}
            onCurrentTimeChange={handleCurrentTimeChange}
            duration={duration}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
