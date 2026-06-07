"use client";

import { useState } from "react";
import { Play, Volume2, Maximize, SkipBack, SkipForward } from "lucide-react";

interface Props {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: Props) {
  const [started, setStarted] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden border border-navy-600/50">
      {/* Player wrapper */}
      <div className="relative aspect-video bg-navy group">
        {!started ? (
          /* Thumbnail / splash */
          <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setStarted(true)}>
            {/* Dark gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-midnight via-navy to-midnight" />

            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(124,58,237,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(124,58,237,0.8) 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            />

            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-peak/20 rounded-full blur-3xl" />
            </div>

            {/* Play button */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center shadow-2xl glow-purple group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-sm">{title}</div>
                <div className="text-muted text-xs mt-1">Click to watch</div>
              </div>
            </div>
          </div>
        ) : (
          /* Iframe embed */
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`${videoUrl}?autoplay=1&rel=0&modestbranding=1&color=white`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Custom controls bar (decorative — iframe handles real controls) */}
      {!started && (
        <div className="px-5 py-4 flex items-center justify-between border-t border-navy-600/40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStarted(true)}
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-peak-400 transition-colors"
            >
              <Play className="w-4 h-4" />
              Play Module
            </button>
          </div>
          <div className="flex items-center gap-3 text-muted">
            <button className="hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors">
              <Volume2 className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
