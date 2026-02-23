import { useEffect, useMemo, useState } from "react";
import "./App.css";

const METHODS = [
  {
    key: "kettlebell",
    label: "Kettlebell",
    description: "Full-body power and conditioning.",
    accent: "linear-gradient(135deg, var(--peach), var(--butter), var(--sky))",
  },
  {
    key: "bodyweight",
    label: "Bodyweight",
    description: "Athletic strength and control.",
    accent: "linear-gradient(135deg, var(--mint), var(--sky), var(--lavender))",
  },
  {
    key: "band",
    label: "Bands",
    description: "Joint-friendly strength and tension.",
    accent: "linear-gradient(135deg, var(--lavender), var(--sky), var(--peach))",
  },
];

const EXERCISES = {
  kettlebell: [
    "Kettlebell Swing",
    "Goblet Squat",
    "Single-Arm Clean",
    "Overhead Press",
    "Reverse Lunge",
    "Deadlift",
    "Bent-Over Row",
    "Halo",
    "Russian Twist",
    "Farmer Carry",
  ],
  bodyweight: [
    "Push-Up",
    "Air Squat",
    "Glute Bridge",
    "Plank",
    "Mountain Climbers",
    "Reverse Lunge",
    "Burpee (no jump)",
    "Dead Bug",
    "Side Plank",
    "High Knees",
  ],
  band: [
    "Band Row",
    "Band Chest Press",
    "Band Squat",
    "Band Pull-Apart",
    "Band Overhead Press",
    "Band Deadlift",
    "Band Face Pull",
    "Band Pallof Press",
    "Band Biceps Curl",
    "Band Triceps Pressdown",
  ],
};

const CUES = [
  "Keep your core engaged",
  "Move with steady control",
  "Focus on full range of motion",
];

const makeSvg = (label, color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="28" fill="${color}" />
      <circle cx="80" cy="52" r="16" fill="rgba(31,41,55,0.7)" />
      <rect x="74" y="68" width="12" height="40" rx="6" fill="rgba(31,41,55,0.7)" />
      <rect x="46" y="80" width="24" height="10" rx="5" fill="rgba(31,41,55,0.6)" />
      <rect x="90" y="80" width="24" height="10" rx="5" fill="rgba(31,41,55,0.6)" />
      <rect x="56" y="110" width="24" height="10" rx="5" fill="rgba(31,41,55,0.6)" />
      <rect x="80" y="110" width="24" height="10" rx="5" fill="rgba(31,41,55,0.6)" />
      <text x="80" y="145" text-anchor="middle" font-family="SF Pro Display, Inter, sans-serif"
        font-size="10" fill="rgba(31,41,55,0.7)">${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const dayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
};

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("kb_dark") === "1");
  const [settings, setSettings] = useState({ work: 40, rest: 20, rounds: 1 });
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [customRoutine, setCustomRoutine] = useState([]);
  const [routineName, setRoutineName] = useState("");
  const [routineError, setRoutineError] = useState("");
  const [savedRoutines, setSavedRoutines] = useState(() => {
    const stored = localStorage.getItem("kb_saved_routines");
    return stored ? JSON.parse(stored) : [];
  });
  const [session, setSession] = useState({
    active: false,
    running: false,
    phase: "work",
    exerciseIndex: 0,
    round: 1,
    remaining: settings.work,
  });

  useEffect(() => {
    localStorage.setItem("kb_dark", dark ? "1" : "0");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("kb_saved_routines", JSON.stringify(savedRoutines));
  }, [savedRoutines]);

  const todayMethod = useMemo(() => {
    const index = dayOfYear(new Date()) % METHODS.length;
    return METHODS[index];
  }, []);

  useEffect(() => {
    setSelectedMethod(todayMethod.key);
  }, [todayMethod.key]);

  const activeMethod = METHODS.find((m) => m.key === selectedMethod) ?? todayMethod;
  const exercises = EXERCISES[activeMethod.key].map((name, index) => ({
    name,
    id: `${activeMethod.key}-${index}`,
    cues: CUES,
    image: makeSvg(name.split(" ")[0], "#f5f6fb"),
  }));
  const allExercises = Object.entries(EXERCISES).flatMap(([methodKey, list]) =>
    list.map((name, index) => ({
      name,
      id: `${methodKey}-${index}`,
      method: METHODS.find((method) => method.key === methodKey)?.label ?? methodKey,
      image: makeSvg(name.split(" ")[0], "#f5f6fb"),
    }))
  );

  useEffect(() => {
    if (!session.active || !session.running) return;
    const timer = window.setInterval(() => {
      setSession((prev) => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [session.active, session.running]);

  useEffect(() => {
    if (!session.active || !session.running) return;
    if (session.remaining > 0) return;

    setSession((prev) => {
      const lastExercise = prev.exerciseIndex >= exercises.length - 1;
      const lastRound = prev.round >= settings.rounds;

      if (prev.phase === "work") {
        if (settings.rest > 0) {
          return { ...prev, phase: "rest", remaining: settings.rest };
        }
        if (lastExercise && lastRound) {
          return { ...prev, running: false };
        }
        return {
          ...prev,
          phase: "work",
          exerciseIndex: lastExercise ? 0 : prev.exerciseIndex + 1,
          round: lastExercise ? prev.round + 1 : prev.round,
          remaining: settings.work,
        };
      }

      if (lastExercise && lastRound) {
        return { ...prev, running: false };
      }

      return {
        ...prev,
        phase: "work",
        exerciseIndex: lastExercise ? 0 : prev.exerciseIndex + 1,
        round: lastExercise ? prev.round + 1 : prev.round,
        remaining: settings.work,
      };
    });
  }, [session.remaining, session.active, session.running, exercises.length, settings.rounds, settings.rest, settings.work]);

  const startSession = () => {
    setSession({
      active: true,
      running: true,
      phase: "work",
      exerciseIndex: 0,
      round: 1,
      remaining: settings.work,
    });
  };

  const stopSession = () => {
    setSession((prev) => ({ ...prev, running: false }));
  };

  const resetSession = () => {
    setSession({
      active: false,
      running: false,
      phase: "work",
      exerciseIndex: 0,
      round: 1,
      remaining: settings.work,
    });
  };

  const currentExercise = exercises[session.exerciseIndex];
  const customExerciseList = allExercises.filter((exercise) => customRoutine.includes(exercise.id));

  const saveRoutine = () => {
    if (!routineName.trim()) {
      setRoutineError("Add a routine name before saving.");
      return;
    }
    if (customRoutine.length === 0) {
      setRoutineError("Select at least one exercise.");
      return;
    }
    setRoutineError("");
    const newRoutine = {
      id: `routine-${Date.now()}`,
      name: routineName.trim(),
      exerciseIds: customRoutine,
    };
    setSavedRoutines((prev) => [newRoutine, ...prev]);
    setRoutineName("");
  };

  const loadRoutine = (routine) => {
    setCustomRoutine(routine.exerciseIds);
  };

  return (
    <div className="app-shell">
      <div className="app">
        <div className="card-header">
          <div>
            <div className="page-title">Daily Kettlebell Challenge</div>
            <div className="page-subtitle">Rotate methods daily, stay challenged.</div>
          </div>
          <button className="toggle" onClick={() => setDark((prev) => !prev)}>
            {dark ? "Dark" : "Light"}
          </button>
        </div>

        <div className="hero">
          <div className="daily-banner">
            <div className="section-title">Today&apos;s Method</div>
            <div className="section-subtitle">{todayMethod.description}</div>
            <div style={{ marginTop: "1rem" }}>
              <span className="pill">{todayMethod.label}</span>
            </div>
            <p className="footer-note" style={{ marginTop: "1rem" }}>
              Method rotates daily: Kettlebell → Bodyweight → Bands.
            </p>
          </div>

          <div className="card">
            <div className="section-title">Timer Setup</div>
            <div className="section-subtitle">Set once before you start.</div>
            <div className="timer-row" style={{ marginTop: "1rem" }}>
              <div className="timer-field">
                <span>Work (sec)</span>
                <input
                  className="timer-input"
                  type="number"
                  min="10"
                  max="90"
                  value={settings.work}
                  onChange={(event) => setSettings((prev) => ({ ...prev, work: Number(event.target.value) }))}
                />
              </div>
              <div className="timer-field">
                <span>Rest (sec)</span>
                <input
                  className="timer-input"
                  type="number"
                  min="0"
                  max="90"
                  value={settings.rest}
                  onChange={(event) => setSettings((prev) => ({ ...prev, rest: Number(event.target.value) }))}
                />
              </div>
              <div className="timer-field">
                <span>Rounds</span>
                <input
                  className="timer-input"
                  type="number"
                  min="1"
                  max="5"
                  value={settings.rounds}
                  onChange={(event) => setSettings((prev) => ({ ...prev, rounds: Number(event.target.value) }))}
                />
              </div>
            </div>
            <div className="session-controls" style={{ marginTop: "1rem" }}>
              <button className="btn btn-primary" onClick={startSession}>
                Start Session
              </button>
              <button className="btn btn-ghost" onClick={resetSession}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-header">
            <div>
              <div className="section-title">Training Methods</div>
              <div className="section-subtitle">Explore all three sets of exercises.</div>
            </div>
            <div className="tabs">
              {METHODS.map((method) => (
                <button
                  key={method.key}
                  className={`tab ${selectedMethod === method.key ? "active" : ""}`}
                  onClick={() => setSelectedMethod(method.key)}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card-soft" style={{ marginBottom: "1rem", background: activeMethod.accent }}>
            <div className="section-title">{activeMethod.label}</div>
            <div className="section-subtitle">{activeMethod.description}</div>
          </div>

          <div className="exercise-list">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <img src={exercise.image} alt={`${exercise.name} illustration`} />
                <div>
                  <div className="exercise-title">{exercise.name}</div>
                  <div className="exercise-cues">
                    {exercise.cues.join(" • ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-header">
            <div>
              <div className="section-title">Build Your Own Routine</div>
              <div className="section-subtitle">Pick exercises from any method to create a custom flow.</div>
            </div>
            <div className="pill">{customRoutine.length} selected</div>
          </div>

          <div className="custom-controls">
            <label className="input-stack">
              <span className="section-subtitle">Routine name</span>
              <input
                className="timer-input"
                type="text"
                value={routineName}
                onChange={(event) => setRoutineName(event.target.value)}
                placeholder="My Full-Body Flow"
              />
            </label>
            <button className="btn btn-primary" type="button" onClick={saveRoutine}>
              Save Routine
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setCustomRoutine([])}>
              Clear Selection
            </button>
          </div>
          {routineError && <div className="error" style={{ marginTop: "0.5rem" }}>{routineError}</div>}

          <div className="saved-list">
            <div className="section-title">Saved Routines</div>
            {savedRoutines.length === 0 ? (
              <div className="footer-note">No saved routines yet.</div>
            ) : (
              <div className="saved-grid">
                {savedRoutines.map((routine) => (
                  <div key={routine.id} className="saved-card">
                    <div className="exercise-title">{routine.name}</div>
                    <div className="exercise-cues">
                      {routine.exerciseIds
                        .map((id) => allExercises.find((exercise) => exercise.id === id)?.name)
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                    <button className="btn btn-ghost" type="button" onClick={() => loadRoutine(routine)}>
                      Select routine
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {allExercises.length === 0 ? (
            <div className="footer-note">Exercises are loading. Please refresh if this persists.</div>
          ) : (
            <div className="custom-grid">
              {allExercises.map((exercise) => {
                const isSelected = customRoutine.includes(exercise.id);
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    className={`custom-item ${isSelected ? "selected" : ""}`}
                    onClick={() =>
                      setCustomRoutine((prev) =>
                        prev.includes(exercise.id)
                          ? prev.filter((id) => id !== exercise.id)
                          : [...prev, exercise.id]
                      )
                    }
                  >
                    <img src={exercise.image} alt={`${exercise.name} illustration`} />
                    <div>
                      <div className="exercise-title">{exercise.name}</div>
                      <div className="exercise-cues">{exercise.method}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="session-controls" style={{ marginTop: "1rem" }}>
            <button className="btn btn-primary" type="button">
              Start Custom Session
            </button>
            <span className="footer-note">
              Selected exercises: {customExerciseList.length}
            </span>
          </div>
        </div>

        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="section-title">Session</div>
          <div className="section-subtitle">
            {session.active ? "Follow along with the timer." : "Start a session to begin."}
          </div>

          {session.active && currentExercise && (
            <div className="session-panel" style={{ marginTop: "1rem" }}>
              <div className="exercise-card">
                <img src={currentExercise.image} alt={`${currentExercise.name} illustration`} />
                <div>
                  <div className="exercise-title">{currentExercise.name}</div>
                  <div className="exercise-cues">{currentExercise.cues.join(" • ")}</div>
                  <div className="muted" style={{ marginTop: "0.3rem" }}>
                    Round {session.round} of {settings.rounds} · Exercise {session.exerciseIndex + 1} of {exercises.length}
                  </div>
                </div>
              </div>

              <div className="session-timer">
                {formatTime(session.remaining)}
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {session.phase.toUpperCase()}
                </div>
              </div>

              <div className="session-controls">
                <button className="btn btn-primary" onClick={() => setSession((prev) => ({ ...prev, running: !prev.running }))}>
                  {session.running ? "Pause" : "Resume"}
                </button>
                <button className="btn btn-ghost" onClick={stopSession}>
                  Stop
                </button>
                <button className="btn btn-ghost" onClick={resetSession}>
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}