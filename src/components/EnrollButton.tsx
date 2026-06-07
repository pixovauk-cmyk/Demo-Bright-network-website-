"use client";

import { useState } from "react";
import EnrollModal from "./EnrollModal";

interface Props {
  courseTitle: string;
  courseLevel: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function EnrollButton({
  courseTitle,
  courseLevel,
  label = "Start Programme",
  className = "btn-primary w-full justify-center text-sm",
  style,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className}
        style={{ display: "flex", ...style }}
      >
        {label}
      </button>

      {open && (
        <EnrollModal
          courseTitle={courseTitle}
          courseLevel={courseLevel}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
