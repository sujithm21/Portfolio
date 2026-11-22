'use client';

import { RotateCcw } from 'lucide-react';

/** The build plays on every load, so replaying it is a reload from the top. */
export default function ReplayButton() {
  const replay = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={replay}
      data-replay
      data-magnetic
      className="btn btn-ghost group"
    >
      <RotateCcw className="size-4 transition-transform duration-500 ease-out-quint group-hover:-rotate-180" />
      Replay the build
    </button>
  );
}
