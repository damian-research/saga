// Loader.jsx
import React from "react";

export const Loader = ({
  size = "medium",
  color = "blue",
  fullscreen = false,
}) => {
  const sizes = {
    small: "w-6 h-6 border-2",
    medium: "w-12 h-12 border-4",
    large: "w-16 h-16 border-4",
  };

  const spinner = (
    <div
      className={`${sizes[size]} border-${color}-500 border-t-transparent rounded-full animate-spin`}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center p-4">{spinner}</div>;
};
