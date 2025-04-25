import AudioVisualizer from '@/components/AudioVisualizer'
import React from 'react'

export default function AiChat() {
  return (
    <div className="w-screen h-screen">
      <SoundVisualizer audioUrl="/path/to/your/audio-file.mp3" width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
}
