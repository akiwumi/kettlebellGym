import { useEffect, useMemo, useState } from "react";
import "./App.css";

const METHODS = [
  {
    key: "kettlebell",
    label: "Kettlebell",
    emoji: "🔔",
    description: "Full-body power and conditioning.",
    accent: "linear-gradient(135deg, var(--peach), var(--butter), var(--sky))",
  },
  {
    key: "bodyweight",
    label: "Bodyweight",
    emoji: "🤸",
    description: "Athletic strength and control.",
    accent: "linear-gradient(135deg, var(--mint), var(--sky), var(--lavender))",
  },
  {
    key: "band",
    label: "Bands",
    emoji: "🏋️",
    description: "Joint-friendly strength and tension.",
    accent: "linear-gradient(135deg, var(--lavender), var(--sky), var(--peach))",
  },
];

const EXERCISE_DATA = {
  kettlebell: [
    { name: "Kettlebell Swing", cues: ["Hinge at hips", "Snap hips forward", "Arms relaxed"] },
    { name: "Goblet Squat", cues: ["Elbows inside knees", "Chest tall", "Full depth"] },
    { name: "Single-Arm Clean", cues: ["Zip to rack", "Punch through", "Quiet catch"] },
    { name: "Overhead Press", cues: ["Ribs down", "Biceps by ear", "Lockout strong"] },
    { name: "Reverse Lunge", cues: ["Step back softly", "Front knee tracks toes", "Drive up"] },
    { name: "Deadlift", cues: ["Hinge", "Lats tight", "Stand tall"] },
    { name: "Bent-Over Row", cues: ["Flat back", "Row to ribs", "Control down"] },
    { name: "Halo", cues: ["Tight circle", "Elbows close", "Smooth motion"] },
    { name: "Russian Twist", cues: ["Tall spine", "Rotate ribs", "Breathe"] },
    { name: "Farmer Carry", cues: ["Shoulders down", "Brace", "Steady steps"] },
  ],
  bodyweight: [
    { name: "Push-Up", cues: ["Body straight", "Elbows ~45°", "Full range"] },
    { name: "Air Squat", cues: ["Knees track toes", "Chest tall", "Sit deep"] },
    { name: "Glute Bridge", cues: ["Ribs down", "Squeeze glutes", "Pause at top"] },
    { name: "Plank", cues: ["Brace", "Push floor away", "Neutral neck"] },
    { name: "Mountain Climbers", cues: ["Hips low", "Fast feet", "Hands planted"] },
    { name: "Reverse Lunge", cues: ["Soft step back", "Tall torso", "Drive up"] },
    { name: "Burpee (no jump)", cues: ["Hands down", "Step back", "Stand tall"] },
    { name: "Dead Bug", cues: ["Low back down", "Slow reach", "Exhale"] },
    { name: "Side Plank", cues: ["Hips high", "Stack shoulders", "Breathe"] },
    { name: "High Knees", cues: ["Tall posture", "Quick rhythm", "Soft landing"] },
  ],
  band: [
    { name: "Band Row", cues: ["Shoulders down", "Pull to ribs", "Pause"] },
    { name: "Band Chest Press", cues: ["Brace", "Press forward", "Control back"] },
    { name: "Band Squat", cues: ["Tension all reps", "Knees track", "Drive up"] },
    { name: "Band Pull-Apart", cues: ["Straight arms", "Squeeze upper back", "No shrug"] },
    { name: "Band Overhead Press", cues: ["Ribs down", "Press up", "Lockout"] },
    { name: "Band Deadlift", cues: ["Hinge", "Lats on", "Stand tall"] },
    { name: "Band Face Pull", cues: ["Elbows high", "Pull to eyes", "Squeeze"] },
    { name: "Band Pallof Press", cues: ["Brace hard", "Press away", "No rotation"] },
    { name: "Band Biceps Curl", cues: ["Elbows pinned", "Full squeeze", "Slow down"] },
    { name: "Band Triceps Pressdown", cues: ["Elbows tight", "Lockout", "Control"] },
  ],
};

const METHOD_COLORS = {
  kettlebell: "#fff1e6",
  bodyweight: "#e6f9f1",
  band: "#ede6ff",
};

// Build flat exercise list at module level — always available, never re-computed
const ALL_EXERCISES = Object.entries(EXERCISE_DATA).flatMap(([methodKey, list]) =>
  list.map((ex, index) => ({
    ...ex,
    id: `${methodKey}-${index}`,
    methodKey,
    methodLabel: METHODS.find((m) => m.key === methodKey)?.label ?? methodKey,
    methodEmoji: METHODS.find((m) => m.key === methodKey)?.emoji ?? "",
    color: METHOD_COLORS[methodKey] ?? "#f5f6fb",
  }))
);

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
  const [customSelected, setCustomSelected] = useState([]);
  const [routineName, setRoutineName] = useState("");
  const [routineError, setRoutineError] = useState("");
  const [savedRoutines, setSavedRoutines] = useState(() => {
    try {
      const stored = localStorage.getItem("kb_saved_routines");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [session, setSession] = useState({
    active: false,
    running: false,
    phase: "work",
    exerciseIndex: 0,
    round: 1,
    remaining: 40,
    exerciseList: [],
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
  const dailyExercises = EXERCISE_DATA[activeMethod.key] ?? [];

  // Timer tick
  useEffect(() => {
    if (!session.active || !session.running) return;
    const timer = window.setInterval(() => {
      setSession((prev) => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [session.active, session.running]);

  // Phase advance
  useEffect(() => {
    if (!session.active || !session.running || session.remaining > 0) return;
    setSession((prev) => {
      const total = prev.exerciseList.length;
      const lastEx = prev.exerciseIndex >= total - 1;
      const lastRound = prev.round >= settings.rounds;

      if (prev.phase === "work") {
        if (settings.rest > 0) return { ...prev, phase: "rest", remaining: settings.rest };
        if (lastEx && lastRound) return { ...prev, running: false };
        return {
          ...prev,
          phase: "work",
          exerciseIndex: lastEx ? 0 : prev.exerciseIndex + 1,
          round: lastEx ? prev.round + 1 : prev.round,
          remaining: settings.work,
        };
      }
      if (lastEx && lastRound) return { ...prev, running: false };
      return {
        ...prev,
        phase: "work",
        exerciseIndex: lastEx ? 0 : prev.exerciseIndex + 1,
        round: lastEx ? prev.round + 1 : prev.round,
        remaining: settings.work,
      };
    });
  }, [session.remaining, session.active, session.running, settings]);

  const startDailySession = () => {
    setSession({
      active: true, running: true, phase: "work",
      exerciseIndex: 0, round: 1,
      remaining: settings.work,
      exerciseList: dailyExercises,
    });
  };

  const startCustomSession = () => {
    const list = ALL_EXERCISES.filter((ex) => customSelected.includes(ex.id));
    if (list.length === 0) return;
    setSession({
      active: true, running: true, phase: "work",
      exerciseIndex: 0, round: 1,
      remaining: settings.work,
      exerciseList: list,
    });
  };

  const endSession = () => {
    setSession((prev) => ({
      ...prev, active: false, running: false,
      exerciseIndex: 0, round: 1, phase: "work",
    }));
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const saveRoutine = () => {
    if (!routineName.trim()) { setRoutineError("Add a name first."); return; }
    if (customSelected.length === 0) { setRoutineError("Select at least one exercise."); return; }
    setRoutineError("");
    setSavedRoutines((prev) => [
      { id: `r-${Date.now()}`, name: routineName.trim(), exerciseIds: [...customSelected] },
      ...prev,
    ]);
    setRoutineName("");
  };

  const deleteRoutine = (id) => setSavedRoutines((prev) => prev.filter((r) => r.id !== id));

  const toggleExercise = (id) => {
    setCustomSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const currentExercise = session.exerciseList[session.exerciseIndex];

  return (
    <div className="app-shell">
      <div className="app">

        {/* ── Top bar ── */}
        <div className="card-header">
          <div>
            <div className="page-title">Daily Kettlebell Challenge</div>
            <div className="page-subtitle">Rotate methods daily, stay challenged.</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="toggle" onClick={() => setDark((prev) => !prev)}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button className="toggle" style={{ color: "#e11d48" }} onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Hero: today's method + timer ── */}
        <div className="hero">
          <div className="daily-banner">
            <div className="section-title">Today&apos;s Method</div>
            <div className="section-subtitle">{todayMethod.description}</div>
            <div style={{ marginTop: "0.75rem" }}>
              <span className="pill">{todayMethod.emoji} {todayMethod.label}</span>
            </div>
            <p className="footer-note" style={{ marginTop: "1rem" }}>
              Rotates daily: Kettlebell → Bodyweight → Bands
            </p>
          </div>

          <div className="card">
            <div className="section-title">Timer Setup</div>
            <div className="section-subtitle">Set before starting.</div>
            <div className="timer-row" style={{ marginTop: "1rem" }}>
              {[
                { label: "Work (sec)", key: "work", min: 10, max: 90 },
                { label: "Rest (sec)", key: "rest", min: 0, max: 90 },
                { label: "Rounds", key: "rounds", min: 1, max: 5 },
              ].map(({ label, key, min, max }) => (
                <div key={key} className="timer-field">
                  <span>{label}</span>
                  <input
                    className="timer-input"
                    type="number"
                    min={min}
                    max={max}
                    value={settings[key]}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="session-controls" style={{ marginTop: "1rem" }}>
              <button className="btn btn-primary" onClick={startDailySession}>
                Start Today&apos;s Session
              </button>
              <button className="btn btn-ghost" onClick={endSession}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Active session ── */}
        {session.active && currentExercise && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div className="card-header">
              <div>
                <div className="section-title">Session Running</div>
                <div className="section-subtitle">
                  Round {session.round} of {settings.rounds} · Exercise {session.exerciseIndex + 1} of {session.exerciseList.length}
                </div>
              </div>
              <button className="btn btn-ghost" onClick={endSession}>End</button>
            </div>
            <div className="ex-row">
              <div className="ex-icon" style={{ background: METHOD_COLORS[currentExercise.methodKey] ?? "#f5f6fb" }}>
                {currentExercise.methodEmoji}
              </div>
              <div>
                <div className="exercise-title">{currentExercise.name}</div>
                <div className="exercise-cues">{currentExercise.cues.join(" • ")}</div>
              </div>
            </div>
            <div className="session-timer" style={{ marginTop: "1rem" }}>
              <div>{formatTime(session.remaining)}</div>
              <div className="muted" style={{ fontSize: "0.85rem" }}>{session.phase.toUpperCase()}</div>
            </div>
            <div className="session-controls" style={{ marginTop: "1rem" }}>
              <button className="btn btn-primary" onClick={() => setSession((p) => ({ ...p, running: !p.running }))}>
                {session.running ? "Pause" : "Resume"}
              </button>
              <button className="btn btn-ghost" onClick={endSession}>End Session</button>
            </div>
          </div>
        )}

        {/* ── Training Methods browser ── */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-header">
            <div>
              <div className="section-title">Training Methods</div>
              <div className="section-subtitle">Browse exercises by method.</div>
            </div>
            <div className="tabs">
              {METHODS.map((method) => (
                <button
                  key={method.key}
                  className={`tab ${selectedMethod === method.key ? "active" : ""}`}
                  onClick={() => setSelectedMethod(method.key)}
                >
                  {method.emoji} {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card-soft" style={{ marginBottom: "1rem", background: activeMethod.accent }}>
            <div className="section-title">{activeMethod.emoji} {activeMethod.label}</div>
            <div className="section-subtitle">{activeMethod.description}</div>
          </div>

          <div className="exercise-list">
            {dailyExercises.map((exercise, index) => (
              <div key={`${activeMethod.key}-${index}`} className="exercise-card">
                <div className="ex-icon" style={{ background: METHOD_COLORS[activeMethod.key] }}>
                  {activeMethod.emoji}
                </div>
                <div>
                  <div className="exercise-title">{exercise.name}</div>
                  <div className="exercise-cues">{exercise.cues.join(" • ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Build Your Own Routine ── */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-header">
            <div>
              <div className="section-title">Build Your Own Routine</div>
              <div className="section-subtitle">
                Tap exercises to select them · {customSelected.length} selected
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => setCustomSelected([])}>
              Clear
            </button>
          </div>

          {/* Name + save */}
          <div className="custom-controls">
            <label className="input-stack">
              <span className="section-subtitle">Routine name</span>
              <input
                className="timer-input"
                style={{ width: "100%", textAlign: "left" }}
                type="text"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="e.g. Morning Power"
              />
            </label>
            <button className="btn btn-primary" type="button" onClick={saveRoutine}>
              Save
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={startCustomSession}
              disabled={customSelected.length === 0}
            >
              Start
            </button>
          </div>
          {routineError && <div className="error" style={{ marginBottom: "0.75rem" }}>{routineError}</div>}

          {/* Saved routines */}
          {savedRoutines.length > 0 && (
            <div className="saved-list">
              <div className="section-title" style={{ marginBottom: "0.5rem" }}>Saved Routines</div>
              <div className="saved-grid">
                {savedRoutines.map((routine) => (
                  <div key={routine.id} className="saved-card">
                    <div className="exercise-title">{routine.name}</div>
                    <div className="exercise-cues">
                      {routine.exerciseIds
                        .map((id) => ALL_EXERCISES.find((ex) => ex.id === id)?.name)
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => setCustomSelected(routine.exerciseIds)}
                      >
                        Load
                      </button>
                      <button
                        className="btn btn-ghost"
                        type="button"
                        style={{ color: "#e11d48" }}
                        onClick={() => deleteRoutine(routine.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All exercises — grouped by method */}
          {METHODS.map((method) => (
            <div key={method.key} style={{ marginBottom: "1.5rem" }}>
              <div className="method-group-label">
                {method.emoji} {method.label}
              </div>
              <div className="custom-grid">
                {ALL_EXERCISES.filter((ex) => ex.methodKey === method.key).map((exercise) => {
                  const selected = customSelected.includes(exercise.id);
                  return (
                    <div
                      key={exercise.id}
                      role="button"
                      tabIndex={0}
                      className={`custom-item${selected ? " selected" : ""}`}
                      onClick={() => toggleExercise(exercise.id)}
                      onKeyDown={(e) => e.key === "Enter" && toggleExercise(exercise.id)}
                    >
                      <div className="ex-icon" style={{ background: exercise.color }}>
                        {exercise.methodEmoji}
                      </div>
                      <div>
                        <div className="exercise-title">{exercise.name}</div>
                        <div className="exercise-cues">{exercise.cues.join(" • ")}</div>
                      </div>
                      {selected && <div className="check-badge">✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}