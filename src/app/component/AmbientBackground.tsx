interface AmbientBackgroundProps {
  colors?: [string, string, string];
}

/** Slow-drifting blurred glow blobs for atmosphere behind static screens
 * (e.g. character creation). Pure CSS keyframes — no JS ticking needed. */
export function AmbientBackground({ colors = ["#38bdf8", "#a855f7", "#f97316"] }: AmbientBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-drift-a absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: colors[0] }}
      />
      <div
        className="animate-drift-b absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: colors[1] }}
      />
      <div
        className="animate-drift-c absolute -bottom-40 left-1/3 h-[34rem] w-[34rem] rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: colors[2] }}
      />
    </div>
  );
}
