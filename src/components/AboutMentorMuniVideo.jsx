import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Bot } from "lucide-react";
import videoThumbnail from "../assets/mentormuni-video-thumbnail.png";

/**
 * Set your video source here:
 * - YouTube: use embed URL e.g. "https://www.youtube.com/embed/VIDEO_ID" or "https://www.youtube.com/watch?v=VIDEO_ID"
 * - Self-hosted: put your .mp4 in public/ and use e.g. "/mentormuni-intro.mp4"
 * Leave empty to show the placeholder until you add a video.
 */
const VIDEO_SOURCE = ""; // e.g. "https://www.youtube.com/embed/xxxx" or "/mentormuni-intro.mp4"

const isYouTube = (url) =>
  url && (url.includes("youtube.com") || url.includes("youtu.be"));

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  const id = match ? match[1] : null;
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : url;
};

export default function AboutMentorMuniVideo() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(!VIDEO_SOURCE);
  const videoRef = useRef(null);

  const hasVideo = Boolean(VIDEO_SOURCE);
  const youtubeUrl = hasVideo && isYouTube(VIDEO_SOURCE) ? getYouTubeEmbedUrl(VIDEO_SOURCE) : null;
  const isNativeVideo = hasVideo && !youtubeUrl;

  const togglePlay = () => {
    if (showPlaceholder) {
      setShowPlaceholder(false);
      setPlaying(true);
      if (videoRef.current) videoRef.current.play();
      return;
    }
    if (isNativeVideo && videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleVideoPlay = () => setPlaying(true);
  const handleVideoPause = () => setPlaying(false);

  return (
    <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-[#FFF8EE] to-[#FFFDF8]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9500]/20 border border-[#FFB347]/40 text-[#CC7000] text-sm font-medium mb-4">
            <Bot className="w-4 h-4" />
            <span>Introducing MentorMuni</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Meet MentorMuni — Our Story in a Video
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our motto, what we offer students, and how we help you crack placements. Watch the short video below.
          </p>
        </div>

        {/* Video container */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/80 shadow-2xl shadow-black/30 aspect-video group">
          {!hasVideo ? (
            /* Placeholder with thumbnail when no video URL is set */
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            >
              <img
                src={videoThumbnail}
                alt="Meet MentorMuni — Our story and what we offer students"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-white/95 flex items-center justify-center text-foreground shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 ml-1" fill="currentColor" />
              </div>
              <p className="relative z-10 mt-4 text-white font-semibold drop-shadow-lg">MentorMuni — Our story & what we offer students</p>
            </div>
          ) : youtubeUrl ? (
            /* YouTube embed */
            <>
              <iframe
                title="MentorMuni intro video"
                src={showPlaceholder ? "" : `${youtubeUrl}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {showPlaceholder && (
                <div
                  onClick={() => setShowPlaceholder(false)}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 ml-1" fill="currentColor" />
                  </div>
                  <p className="mt-4 text-white font-semibold">Play video</p>
                </div>
              )}
            </>
          ) : (
            /* Native HTML5 video (e.g. /mentormuni-intro.mp4) */
            <>
              <video
                ref={videoRef}
                src={VIDEO_SOURCE}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted={muted}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onClick={togglePlay}
              />
              <div
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center text-foreground shadow-xl">
                  {playing ? (
                    <Pause className="w-10 h-10" fill="currentColor" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" fill="currentColor" />
                  )}
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Short summary below video */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            We help students know their placement readiness, practice with AI mock interviews, and improve with mentor guidance. Start with free tools — no signup required.
          </p>
        </div>
      </div>
    </section>
  );
}
