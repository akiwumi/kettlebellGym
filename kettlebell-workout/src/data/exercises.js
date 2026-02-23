export const METHODS = {
    kettlebell: {
      key: "kettlebell",
      label: "Kettlebell",
      subtitle: "Full-body power + conditioning",
    accent: "from-peach via-butter to-sky",
    },
    bodyweight: {
      key: "bodyweight",
      label: "Bodyweight",
      subtitle: "Athletic strength + control",
    accent: "from-mint via-ice to-sky",
    },
    band: {
      key: "band",
      label: "Bands",
      subtitle: "Joint-friendly strength + tension",
    accent: "from-lavender via-ice to-sky",
    },
  };
  
  // We map each exercise to a simple animation “type” (reused SVG animations).
  // That keeps it lightweight while still showing movement.
  export const EXERCISES = {
    kettlebell: [
      { id: "kb1", name: "Kettlebell Swing", cues: ["Hinge at hips", "Snap hips forward", "Arms relaxed"], anim: "hingeSwing" },
      { id: "kb2", name: "Goblet Squat", cues: ["Elbows inside knees", "Chest tall", "Full depth"], anim: "squat" },
      { id: "kb3", name: "Single-Arm Clean", cues: ["Zip to rack", "Punch through", "Quiet catch"], anim: "cleanRack" },
      { id: "kb4", name: "Overhead Press", cues: ["Ribs down", "Biceps by ear", "Lockout strong"], anim: "press" },
      { id: "kb5", name: "Reverse Lunge (Goblet)", cues: ["Step back softly", "Front knee tracks toes", "Drive up"], anim: "lunge" },
      { id: "kb6", name: "Deadlift", cues: ["Hinge", "Lats tight", "Stand tall"], anim: "hingeSwing" },
      { id: "kb7", name: "Bent-Over Row", cues: ["Flat back", "Row to ribs", "Control down"], anim: "row" },
      { id: "kb8", name: "Halo", cues: ["Tight circle", "Elbows close", "Smooth motion"], anim: "halo" },
      { id: "kb9", name: "Russian Twist", cues: ["Tall spine", "Rotate ribs", "Breathe"], anim: "twist" },
      { id: "kb10", name: "Farmer Carry (March)", cues: ["Shoulders down", "Brace", "Steady steps"], anim: "carryMarch" },
    ],
    bodyweight: [
      { id: "bw1", name: "Push-Up", cues: ["Body straight", "Elbows ~45°", "Full range"], anim: "pushup" },
      { id: "bw2", name: "Air Squat", cues: ["Knees track toes", "Chest tall", "Sit between heels"], anim: "squat" },
      { id: "bw3", name: "Glute Bridge", cues: ["Ribs down", "Squeeze glutes", "Pause at top"], anim: "bridge" },
      { id: "bw4", name: "Plank", cues: ["Brace", "Push floor away", "Neutral neck"], anim: "plank" },
      { id: "bw5", name: "Mountain Climbers", cues: ["Hips low", "Fast feet", "Hands planted"], anim: "climbers" },
      { id: "bw6", name: "Reverse Lunge", cues: ["Soft step back", "Tall torso", "Drive up"], anim: "lunge" },
      { id: "bw7", name: "Burpee (No Jump)", cues: ["Hands down", "Step back", "Stand tall"], anim: "burpee" },
      { id: "bw8", name: "Dead Bug", cues: ["Low back down", "Slow reach", "Exhale"], anim: "deadbug" },
      { id: "bw9", name: "Side Plank", cues: ["Hips high", "Stack shoulders", "Breathe"], anim: "sideplank" },
      { id: "bw10", name: "High Knees", cues: ["Tall posture", "Quick rhythm", "Soft landing"], anim: "highknees" },
    ],
    band: [
      { id: "bd1", name: "Band Row", cues: ["Shoulders down", "Pull to ribs", "Pause"], anim: "row" },
      { id: "bd2", name: "Band Chest Press", cues: ["Brace", "Press forward", "Control back"], anim: "press" },
      { id: "bd3", name: "Band Squat", cues: ["Tension all reps", "Knees track", "Drive up"], anim: "squat" },
      { id: "bd4", name: "Band Pull-Apart", cues: ["Straight arms", "Squeeze upper back", "No shrug"], anim: "pullApart" },
      { id: "bd5", name: "Band Overhead Press", cues: ["Ribs down", "Press up", "Lockout"], anim: "press" },
      { id: "bd6", name: "Band Deadlift", cues: ["Hinge", "Lats on", "Stand tall"], anim: "hingeSwing" },
      { id: "bd7", name: "Band Face Pull", cues: ["Elbows high", "Pull to eyes", "Squeeze"], anim: "facePull" },
      { id: "bd8", name: "Band Pallof Press", cues: ["Brace hard", "Press away", "No rotation"], anim: "pallof" },
      { id: "bd9", name: "Band Biceps Curl", cues: ["Elbows pinned", "Full squeeze", "Slow down"], anim: "curl" },
      { id: "bd10", name: "Band Triceps Pressdown", cues: ["Elbows tight", "Lockout", "Control"], anim: "pressdown" },
    ],
  };