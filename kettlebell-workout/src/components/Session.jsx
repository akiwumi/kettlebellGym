import { useEffect, useMemo, useRef, useState } from "react";
import ExerciseAnimation from "./ExerciseAnimation";

export default function Session({ methodLabel, exercises, settings, onExit }) {
  const list = useMemo(() => exercises.slice(0, settings.exerciseCount), [exercises, settings.exerciseCount]);

  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("work"); // work | rest
  const [remaining, setRemaining] = useState(settings.workSec);

  const intervalRef = useRef(null);

  const current = list[index];

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => r - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (remaining > 0) return;

    // phase switch / advance
    if (phase === "work") {
      if (settings.restSec > 0) {
        setPhase("rest");
        setRemaining(settings.restSec);
      } else {
        advance();
      }
    } else {
      advance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, running]);

  function resetToCurrentWork() {
    setPhase("work");
    setRemaining(settings.workSec);
  }

  function advance() {
    if (index < list.length - 1) {
      setIndex((i) => i + 1);
      setPhase("work");
      setRemaining(settings.workSec);
      return;
    }
    // end of round
    if (round < settings.rounds) {
      setRound((r) => r + 1);
      setIndex(0);
      setPhase("work");
      setRemaining(settings.workSec);
      return;
    }
    // done
    setRunning(false);
  }

  function prev() {
    setRunning(false);
    if (index > 0) setIndex((i) => i - 1);
    resetToCurrentWork();
  }

  function next() {
    setRunning(false);
    advance();
  }

  const done = !running && round === settings.rounds && index === list.length - 1 && phase === "work" && remaining === 0;

  return (
    <div className="min-h-screen px-4 pb-10">
      <div className="mx-auto max-w-4xl pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-muted dark:text-white/70">{methodLabel} Session</div>
            <div className="text-2xl font-bold text-ink dark:text-white">
              Round {round}/{settings.rounds} · Exercise {index + 1}/{list.length}
            </div>
          </div>

          <button
            onClick={onExit}
            className="btn btn-ghost text-ink dark:text-white"
          >
            Exit
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <div className="text-xs font-semibold text-muted dark:text-white/70">
              {phase.toUpperCase()}
            </div>
            <div className="mt-1 text-2xl font-bold text-ink dark:text-white">
              {current.name}
            </div>

            <div className="mt-4">
              <ExerciseAnimation type={current.anim} />
            </div>

            <ul className="mt-4 space-y-1 text-sm text-ink/80 dark:text-white/80">
              {current.cues.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-ink/30 dark:bg-white/40" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted dark:text-white/70">
                Timer
              </div>
              <div className="chip">
                Work {settings.workSec}s · Rest {settings.restSec}s
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-gradient-to-br from-butter via-peach to-sky
                              flex items-center justify-center shadow-soft ring-1 ring-black/5 dark:ring-white/10">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-ink">{Math.max(0, remaining)}</div>
                  <div className="text-xs font-semibold text-ink/70">{phase === "work" ? "WORK" : "REST"}</div>
                </div>
              </div>
            </div>

            {done ? (
              <div className="mt-6 rounded-2xl bg-mint/60 p-4 text-ink font-semibold text-center dark:bg-emerald-400/20 dark:text-emerald-100">
                Session complete 🎉
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <button onClick={prev} className="btn btn-ghost">
                    ← Prev
                  </button>
                  <button
                    onClick={() => setRunning((r) => !r)}
                    className="rounded-2xl py-2 font-semibold bg-ink text-white hover:opacity-95 active:opacity-90 dark:bg-white dark:text-ink"
                  >
                    {running ? "Pause" : "Start"}
                  </button>
                  <button onClick={next} className="btn btn-ghost">
                    Next →
                  </button>
                </div>

                <button
                  onClick={() => { setRunning(false); resetToCurrentWork(); }}
                  className="mt-2 w-full btn btn-ghost"
                >
                  Reset current exercise
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}