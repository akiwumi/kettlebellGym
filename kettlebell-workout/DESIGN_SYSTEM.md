# Design System

Soft, minimal UI tokens and components inspired by the reference dashboard.

## Brand Principles
- Calm and airy
- Rounded geometry
- Gentle contrast
- Minimal borders

## Colors
Primary palette and neutrals are defined as CSS variables in `src/index.css`.

### Core Tokens
- `--bg`: App background
- `--surface`: Main card background
- `--surface-soft`: Secondary card background
- `--text`: Primary text
- `--muted`: Secondary text
- `--shadow`: Card shadow
- `--border`: Card border

### Pastels
- `--butter`
- `--peach`
- `--mint`
- `--lavender`
- `--sky`

## Typography
- Base font: `SF Pro Display`, `SF Pro Text`, `Inter`, system stack
- Weight: 400 body, 600-700 for emphasis
- Use muted text for labels and secondary info

## Layout
Defined in `src/App.css`.
- `.grid`, `.grid-2`, `.grid-3`, `.grid-4`
- Responsive collapse at 900px and 640px

## Components
Defined in `src/App.css`.

### Card
```
<div className="card">...</div>
```

### Soft Card
```
<div className="card-soft">...</div>
```

### Pill
```
<span className="pill">Label</span>
```

### Chip
```
<span className="chip">Label</span>
```

### Primary Button
```
<button className="button">Primary Button</button>
```

### Stat Block
```
<div className="card stat">
  <div className="label">Label</div>
  <div className="value">Value</div>
</div>
```

### Calendar
```
<div className="calendar">
  <div className="day">M</div>
  <div className="date active">07</div>
</div>
```

## Usage
Import the base styles in `src/main.jsx`:
```
import "./index.css";
import "./App.css";
```

## File Map
- Tokens: `src/index.css`
- Components + layout: `src/App.css`
- Example usage: `src/App.jsx`
