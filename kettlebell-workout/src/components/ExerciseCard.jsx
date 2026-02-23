import ExerciseAnimation from "./ExerciseAnimation";

export default function ExerciseCard({ ex, index }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-muted dark:text-white/70">
            Exercise {index + 1}
          </div>
          <div className="text-lg font-semibold text-ink dark:text-white">
            {ex.name}
          </div>
        </div>
        <div className="chip">
          Demo
        </div>
      </div>

      <div className="mt-3">
        <ExerciseAnimation type={ex.anim} />
      </div>

      <ul className="mt-3 space-y-1 text-sm text-ink/80 dark:text-white/80">
        {ex.cues.map((c) => (
          <li key={c} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-ink/30 dark:bg-white/40" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}