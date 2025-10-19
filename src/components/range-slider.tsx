"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const THUMB_WIDTH = 16;

interface ThumbProps {
  type: "start" | "end";
  percentage: number;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  activeThumb: "start" | "end" | null;
  onMouseDown: (thumb: "start" | "end") => (e: React.MouseEvent) => void;
  onTouchStart: (thumb: "start" | "end") => (e: React.TouchEvent) => void;
}

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  className?: string;
  disabled?: boolean;
  thumbnailUrl?: string;
  currentTime: number;
  onCurrentTimeChange: (currentTime: number) => void;
  duration: number;
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  className,
  disabled = false,
  thumbnailUrl,
  currentTime = 0,
  onCurrentTimeChange,
  duration,
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>(
    defaultValue || [min, max]
  );
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const currentValue = value || internalValue;

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (clientX: number) => {
    if (!trackRef.current) return min;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const updateValue = useCallback(
    (newValue: [number, number]) => {
      const sortedValue: [number, number] = [
        Math.min(newValue[0], newValue[1]),
        Math.max(newValue[0], newValue[1]),
      ];

      if (!value) {
        setInternalValue(sortedValue);
      }
      onValueChange?.(sortedValue);
    },
    [value, onValueChange]
  );

  const handleMouseDown = (thumb: "start" | "end") => (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveThumb(thumb);
  };

  const handleTouchStart =
    (thumb: "start" | "end") => (e: React.TouchEvent) => {
      if (disabled) return;
      e.stopPropagation();
      setActiveThumb(thumb);
    };

  useEffect(() => {
    if (!activeThumb || disabled) return;

    const handleMove = (clientX: number) => {
      const newValue = getValueFromPosition(clientX);

      if (activeThumb === "start") {
        updateValue([newValue, currentValue[1]]);
      } else {
        updateValue([currentValue[0], newValue]);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setActiveThumb(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [activeThumb, currentValue, disabled, updateValue]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled || activeThumb) return;

    const newValue = getValueFromPosition(e.clientX);

    if (newValue > currentValue[0] && newValue < currentValue[1]) {
      onCurrentTimeChange((newValue / 100) * duration);
    } else {
      const distanceToStart = Math.abs(newValue - currentValue[0]);
      const distanceToEnd = Math.abs(newValue - currentValue[1]);

      if (distanceToStart < distanceToEnd) {
        updateValue([newValue, currentValue[1]]);
      } else {
        updateValue([currentValue[0], newValue]);
      }
    }
  };

  const startPercentage = getPercentage(currentValue[0]);
  const endPercentage = getPercentage(currentValue[1]);

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={trackRef}
        className={cn(
          "relative h-14 w-full rounded-lg bg-neutral-200 overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer"
        )}
        style={{
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "left center",
        }}
        onClick={handleTrackClick}
      >
        {/* Active range */}
        <div
          className="absolute h-full border-6 border-orange-500 rounded-lg bg-neutral-900/20 overflow-hidden"
          style={{
            left: `${startPercentage}%`,
            width: `${endPercentage - startPercentage}%`,
          }}
        />

        {/* Left range */}
        <div
          className="absolute h-full rounded-l-lg bg-neutral-900/65"
          style={{
            width: `calc(${startPercentage}% + ${THUMB_WIDTH / 2}px)`,
          }}
        />

        {/* Right range */}
        <div
          className="absolute h-full rounded-r-lg bg-neutral-900/65"
          style={{
            right: 0,
            width: `${100 - endPercentage}%`,
          }}
        />

        {/* Current time indicator */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white shadow-lg z-10"
          style={{
            left: `${(currentTime / duration) * 100}%`,
            transform: "translateX(-50%)",
          }}
        />

        {/* Thumbs */}
        <Thumb
          type="start"
          percentage={startPercentage}
          value={currentValue[0]}
          min={min}
          max={max}
          disabled={disabled}
          activeThumb={activeThumb}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />

        <Thumb
          type="end"
          percentage={endPercentage}
          value={currentValue[1]}
          min={min}
          max={max}
          disabled={disabled}
          activeThumb={activeThumb}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </div>
    </div>
  );
}

const Thumb = ({
  type,
  percentage,
  value,
  min,
  max,
  disabled,
  activeThumb,
  onMouseDown,
  onTouchStart,
}: ThumbProps) => {
  const isActive = activeThumb === type;
  const isStart = type === "start";

  return (
    <div
      className={cn(
        "absolute inset-y-0 w-4 bg-orange-500",
        isStart ? "rounded-l-lg" : "rounded-r-lg",
        !disabled && "cursor-grab",
        disabled && "cursor-not-allowed"
      )}
      style={{
        left: `clamp(0px, calc(${percentage}% - ${
          THUMB_WIDTH / 2
        }px), calc(100% - ${THUMB_WIDTH}px))`,
      }}
      onMouseDown={onMouseDown(type)}
      onTouchStart={onTouchStart(type)}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={`${isStart ? "Start" : "End"} value`}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-0.5">
        <span className="bg-white h-5 w-px" />
        <span className="bg-white h-5 w-px" />
      </div>
    </div>
  );
};
