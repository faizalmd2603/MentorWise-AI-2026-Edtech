# Improve the student testimonials carousel

## What will change
- Add Hareem Fatima and Saamia Dua alongside the four existing student testimonials, preserving their institutions and key experiences in concise card copy.
- Replace the current photo-roll entrance with a layered, premium transition: the outgoing story softens and recedes while the incoming story settles into place with restrained depth and staggered text movement.
- Rebuild autoplay around one stable deadline so mobile timer throttling cannot skip a testimonial; every automatic story holds for 5 seconds and every manual selection holds for 15 seconds.
- Pause reliably during mouse hover, keyboard focus, touch press, and when the page is hidden; resume from the remaining time instead of jumping ahead.
- Improve phone controls and card sizing so all six stories are reachable, readable, and visibly selected.

## Verification
- Test automatic order through all six stories on a phone-sized viewport, specifically confirming Muavvidh appears after Mohamed.
- Test previous/next and story selectors, the 15-second manual hold, pause/resume, reduced-motion behavior, and desktop layout.
- Confirm the home page loads without visual, console, or build errors.

## Technical details
- Keep the existing reusable homepage carousel and Midnight Gold design system.
- Use a reducer-style transition state with a single monotonic timeout/deadline rather than overlapping one-second state updates.
- Use semantic CSS animation classes and `prefers-reduced-motion`; no new service or backend changes.
