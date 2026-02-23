export default function SetupModal({ open, onClose, settings, setSettings, onStart }) {
    if (!open) return null;
  
    return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white/90 p-5 shadow-card ring-1 ring-black/10 backdrop-blur dark:bg-night/90 dark:ring-white/10">
          <div className="flex items-center justify-between">
            <div>
            <div className="text-lg font-semibold text-ink dark:text-white">Timer Setup</div>
            <div className="text-sm text-muted dark:text-white/70">Set once before the session</div>
            </div>
            <button
              onClick={onClose}
            className="btn btn-ghost text-ink dark:text-white"
            >
              Close
            </button>
          </div>
  
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Field
              label="Work (seconds)"
              value={settings.workSec}
              onChange={(v) => setSettings((s) => ({ ...s, workSec: v }))}
              min={10}
              max={180}
            />
            <Field
              label="Rest (seconds)"
              value={settings.restSec}
              onChange={(v) => setSettings((s) => ({ ...s, restSec: v }))}
              min={0}
              max={180}
            />
            <Field
              label="Exercises"
              value={settings.exerciseCount}
              onChange={(v) => setSettings((s) => ({ ...s, exerciseCount: v }))}
              min={1}
              max={10}
            />
            <Field
              label="Rounds"
              value={settings.rounds}
              onChange={(v) => setSettings((s) => ({ ...s, rounds: v }))}
              min={1}
              max={5}
            />
          </div>
  
        <div className="mt-4 rounded-2xl bg-ink/5 p-3 text-sm text-ink/80 dark:bg-white/10 dark:text-white/80">
            Total time ≈{" "}
            <span className="font-semibold">
              {estimate(settings)} min
            </span>{" "}
            (approx.)
          </div>
  
          <button
            onClick={onStart}
          className="mt-5 w-full rounded-2xl py-3 font-semibold text-ink btn-primary"
          >
            Start Session
          </button>
        </div>
      </div>
    );
  }
  
  function Field({ label, value, onChange, min, max }) {
    return (
    <label className="rounded-2xl bg-ink/5 p-3 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
      <div className="text-xs font-semibold text-muted dark:text-white/70">{label}</div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
          />
        <div className="w-12 text-right text-sm font-semibold text-ink dark:text-white">
            {value}
          </div>
        </div>
      </label>
    );
  }
  
  function estimate(s) {
    const perExercise = s.workSec + s.restSec;
    const totalSec = perExercise * s.exerciseCount * s.rounds;
    return Math.max(1, Math.round(totalSec / 60));
  }