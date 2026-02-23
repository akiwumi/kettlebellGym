export default function ModeToggle({ dark, setDark }) {
    return (
      <button
        onClick={() => setDark(!dark)}
      className="btn btn-ghost text-ink dark:text-white"
        aria-label="Toggle dark mode"
      >
        {dark ? "🌙 Dark" : "☀️ Light"}
      </button>
    );
  }