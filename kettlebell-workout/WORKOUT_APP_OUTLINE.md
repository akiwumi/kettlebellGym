# Kettlebell Workout App — Outline

## Goal
Build a full-body workout app with three training methods—kettlebell, bodyweight, and bands—each containing 10 exercises. The training method rotates daily to keep the user challenged. Each exercise includes an illustrative image showing form.

## Core Experience
- **Daily method rotation**: Kettlebell → Bodyweight → Bands → repeat
- **10 exercises per method**: Fixed list per method
- **Illustrative images**: One image per exercise with clear form cues
- **Session timer**: Configured before the session starts

## Information Architecture
1. **Home / Daily Plan**
   - Daily method card (today’s method, brief description)
   - Start session button
   - Quick timer summary (work, rest, rounds)
   - Preview of the 10 exercises (title + image)
2. **Timer Setup**
   - Work time, rest time, rounds, exercises count (default 10)
   - Total duration estimate
   - Save and return to Home
3. **Session**
   - Current exercise image + name
   - Form cues (3 short tips)
   - Timer controls (start/pause, next, previous, reset)
4. **Library (Optional)**
   - All exercises grouped by method
   - Image gallery view

## Daily Rotation Logic
- Determine daily method using the calendar date
- Method order:
  - Day 1: Kettlebell
  - Day 2: Bodyweight
  - Day 3: Bands
  - Day 4: Kettlebell (repeat)
- Display “Today’s Method” prominently on Home

## Exercise Lists (10 each)
### Kettlebell
1. Kettlebell Swing
2. Goblet Squat
3. Single-Arm Clean
4. Overhead Press
5. Reverse Lunge
6. Deadlift
7. Bent-Over Row
8. Halo
9. Russian Twist
10. Farmer Carry

### Bodyweight
1. Push-Up
2. Air Squat
3. Glute Bridge
4. Plank
5. Mountain Climbers
6. Reverse Lunge
7. Burpee (no jump)
8. Dead Bug
9. Side Plank
10. High Knees

### Bands
1. Band Row
2. Band Chest Press
3. Band Squat
4. Band Pull-Apart
5. Band Overhead Press
6. Band Deadlift
7. Band Face Pull
8. Band Pallof Press
9. Band Biceps Curl
10. Band Triceps Pressdown

## Illustrative Images
For each exercise:
- **Primary image** showing the key position
- Optional **secondary image** for start/end positions
- Consistent styling (flat illustration or simple vector)
- Clear labeling: exercise name + 2–3 form cues

## Data Model (Conceptual)
- **Method**
  - id, name, description
  - exercises[] (10)
- **Exercise**
  - id, name, method
  - imageUrl (illustration)
  - cues[] (short tips)
- **Session Settings**
  - workSeconds, restSeconds, rounds

## UX Flow
1. Open app → See “Today’s Method”
2. Tap “Set Timer” → configure session
3. Return to Home → tap “Start Session”
4. Run through 10 exercises → finish summary

## Visual & Content Guidelines
- Pastel palette with light background
- Rounded cards and soft shadows
- Large, legible exercise names
- Images occupy primary visual space on each exercise card

## Future Enhancements (Optional)
- Favorites
- Progress tracking
- Sound cues
- Save custom timers per method
