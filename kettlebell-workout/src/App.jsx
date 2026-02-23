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
  const [auth, setAuth] = useState(() => ({
    registered: localStorage.getItem("kb_registered") === "1",
    verified: localStorage.getItem("kb_verified") === "1",
    name: localStorage.getItem("kb_name") ?? "",
    email: localStorage.getItem("kb_email") ?? "",
    password: "",
    code: "",
    error: "",
  }));
  const [settings, setSettings] = useState({ work: 40, rest: 20, rounds: 1 });
  const [selectedMethod, setSelectedMethod] = useState(null);
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
    localStorage.setItem("kb_registered", auth.registered ? "1" : "0");
    localStorage.setItem("kb_verified", auth.verified ? "1" : "0");
    localStorage.setItem("kb_name", auth.name);
    localStorage.setItem("kb_email", auth.email);
  }, [auth.registered, auth.verified, auth.name, auth.email]);

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

  if (!auth.verified) {
    return (
      <div className="app-shell">
        <div className="app">
          <div className="card-header">
            <div>
              <div className="page-title">Kettlebell Daily Flow</div>
              <div className="page-subtitle">Register and verify to unlock the workout.</div>
            </div>
            <button className="toggle" onClick={() => setDark((prev) => !prev)}>
              {dark ? "Dark" : "Light"}
            </button>
          </div>

          <div className="auth-shell">
            <div className="auth-card">
              <div className="section-title">{auth.registered ? "Verify your account" : "Create your account"}</div>
              <div className="section-subtitle">
                {auth.registered
                  ? "Enter the 6-digit code sent to your email."
                  : "Create your account to begin."}
              </div>

              {!auth.registered ? (
                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!auth.name || !auth.email || !auth.password) {
                      setAuth((prev) => ({ ...prev, error: "Please complete all fields." }));
                      return;
                    }
                    setAuth((prev) => ({ ...prev, registered: true, error: "" }));
                  }}
                >
                  <label className="field">
                    <span>Name</span>
                    <input
                      className="input"
                      type="text"
                      value={auth.name}
                      onChange={(event) => setAuth((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Jordan Miles"
                    />
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input
                      className="input"
                      type="email"
                      value={auth.email}
                      onChange={(event) => setAuth((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="jordan@email.com"
                    />
                  </label>
                  <label className="field">
                    <span>Password</span>
                    <input
                      className="input"
                      type="password"
                      value={auth.password}
                      onChange={(event) => setAuth((prev) => ({ ...prev, password: event.target.value }))}
                      placeholder="Create a password"
                    />
                  </label>
                  {auth.error && <div className="error">{auth.error}</div>}
                  <button className="btn btn-primary" type="submit">
                    Create account
                  </button>
                  <div className="helper">Verification is required before starting workouts.</div>
                </form>
              ) : (
                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (auth.code.trim().length !== 6) {
                      setAuth((prev) => ({ ...prev, error: "Enter a 6-digit code." }));
                      return;
                    }
                    setAuth((prev) => ({ ...prev, verified: true, error: "" }));
                  }}
                >
                  <label className="field">
                    <span>Verification code</span>
                    <input
                      className="input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={auth.code}
                      onChange={(event) => setAuth((prev) => ({ ...prev, code: event.target.value }))}
                      placeholder="123456"
                    />
                  </label>
                  {auth.error && <div className="error">{auth.error}</div>}
                  <button className="btn btn-primary" type="submit">
                    Verify & Continue
                  </button>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() =>
                      setAuth({
                        registered: false,
                        verified: false,
                        name: "",
                        email: "",
                        password: "",
                        code: "",
                        error: "",
                      })
                    }
                  >
                    Start over
                  </button>
                </form>
              )}
            </div>

            <div className="card">
              <div className="section-title">What you get</div>
              <div className="section-subtitle">Everything is available after verification.</div>
              <div className="stack" style={{ marginTop: "1rem" }}>
                <div className="pill">10 kettlebell exercises</div>
                <div className="pill">10 bodyweight exercises</div>
                <div className="pill">10 band exercises</div>
                <div className="pill">Daily method rotation</div>
                <div className="pill">Session timer controls</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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