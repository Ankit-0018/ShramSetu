"use client";

type SpinnerProps = {
  text?: string;
  fullscreen?: boolean;
};

export default function Spinner({ text, fullscreen = true }: SpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-5 h-5 animate-spin">
        {[
          { r: 0, c: "#E87722", o: "opacity-100" },
          { r: 45, c: "#E87722", o: "opacity-85" },
          { r: 90, c: "#1A6FAF", o: "opacity-70" },
          { r: 135, c: "#1A6FAF", o: "opacity-55" },
          { r: 180, c: "#1A6FAF", o: "opacity-40" },
          { r: 225, c: "#1A6FAF", o: "opacity-30" },
          { r: 270, c: "#E87722", o: "opacity-20" },
          { r: 315, c: "#E87722", o: "opacity-10" },
        ].map((dot, i) => (
          <span
            key={i}
            className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full ${dot.o}`}
            style={{
              backgroundColor: dot.c,
              transform: `rotate(${dot.r}deg) translate(8px, -3px)`,
              transformOrigin: "0 0",
            }}
          />
        ))}
      </div>

      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="flex items-center justify-center h-screen">{spinner}</div>
    );
  }

  return spinner;
}
