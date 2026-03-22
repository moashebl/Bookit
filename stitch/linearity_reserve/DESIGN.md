```markdown
# Design System Specification: High-End Editorial Booking

## 1. Overview & Creative North Star
**Creative North Star: "The Precision Architect"**
This design system moves beyond the generic "SaaS aesthetic" to create a premium, editorial booking experience. Inspired by the functional density of Linear and the spatial elegance of Notion, we prioritize **Intentional Asymmetry** and **Tonal Depth** over traditional borders. 

By utilizing "The Precision Architect" philosophy, we treat the UI as a series of physical layers rather than a flat screen. We reject the "template" look by using exaggerated white space, high-contrast typography scales, and a "No-Line" architecture that relies on background shifts to define meaning.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, authoritative navy (`primary_container: #002147`) set against a pristine, breathable canvas (`background: #faf9fd`).

### The "No-Line" Rule
**Explicit Mandate:** 1px solid borders are prohibited for sectioning. Boundaries must be defined solely through background color shifts.
- Use `surface_container_low` for secondary sections sitting on a `surface` background.
- Use `surface_container_highest` for sidebars or utility panels to create a clear functional break without "boxing" the user in.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets. 
- **Base Layer:** `surface` (#faf9fd)
- **Content Cards:** `surface_container_lowest` (#ffffff)
- **Nested Elements:** Inside a card, use `surface_container` (#efedf1) for input fields or secondary data points.

### The "Glass & Gradient" Rule
To elevate the "BookIt" experience:
- **Floating Modals:** Use `surface_container_lowest` with a 70% opacity and a `backdrop-blur: 20px`. This makes the layout feel integrated and premium.
- **Signature CTAs:** Apply a subtle linear gradient from `primary` (#000a1e) to `primary_container` (#002147) at a 135-degree angle. This adds "soul" to the primary action buttons, making them feel tactile rather than flat.

---

## 3. Typography: The Editorial Voice
We use **Inter** not as a utility font, but as an editorial tool. The contrast between `display` sizes and `label` sizes creates an authoritative hierarchy.

- **Display & Headlines:** Use `display-md` (2.75rem) for main landing headers. Use `headline-sm` (1.5rem) for section titles. Ensure a `-0.02em` letter-spacing for all headlines to achieve that "Linear-esque" precision.
- **Body & Labels:** `body-md` (0.875rem) is our workhorse. For metadata (time slots, dates), use `label-md` (0.75rem) in `secondary` (#5c5f60) to keep the focus on primary actions.
- **The Hierarchy Rule:** Brand identity is conveyed through extreme scale. A very large `headline-lg` paired immediately with a `body-sm` metadata tag creates a sophisticated, modern look.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural lines.

- **The Layering Principle:** Place a `surface_container_lowest` (Pure White) card on a `surface_container_low` section. This creates a soft, natural lift.
- **Ambient Shadows:** When a shadow is required (e.g., for a floating Profile Card), use a diffused `0 12px 40px` blur with 6% opacity of `on_surface` (#1a1b1e). This mimics natural light.
- **The Ghost Border Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use `outline_variant` (#c4c6cf) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
- **Primary:** Gradient from `primary` to `primary_container`. Radius: `DEFAULT` (0.5rem). Text: `on_primary`.
- **Secondary:** Surface `secondary_container` (#dee0e2). No border.
- **Interactive States:** Hover should involve a subtle `0.5rem` lift (via shadow) and a color shift to `primary_fixed_dim`.

### Interactive Calendars & Time Slots
- **Calendar Grid:** Forbid grid lines. Use `spacing-4` (1.4rem) between dates. The "Current Day" should be highlighted with a `primary_container` circle.
- **Time Slot Cards:** Use `surface_container_low`. On hover, transition to `primary_fixed` with a `0.2s ease-in-out` transition.
- **Selection State:** Use `tertiary_fixed_dim` (#4edea3) with `on_tertiary_fixed` text for a "Confirmed" booking state.

### Modals & Skeletons
- **Centered Modals:** Use `xl` (1.5rem) rounded corners. Background must be the Glassmorphism style (blurred white).
- **Skeleton States:** Instead of grey bars, use a pulsing gradient from `surface_container` to `surface_container_high`. This maintains the "lively" feel of the app during load.

### Profile Cards & Lists
- **The List Rule:** Forbid divider lines. Separate items using `spacing-3` (1rem) and subtle background shifts (e.g., every second item uses `surface_container_low`).
- **Profile Avatars:** Use `lg` (1rem) rounding to match the system's "Precision Architect" aesthetic.

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-8` (2.75rem) and `spacing-12` (4rem) for section margins to allow the design to "breathe."
- **Do** use `on_surface_variant` for secondary text to maintain a soft, sophisticated contrast.
- **Do** rely on the `surface_container` tiers to create hierarchy.

### Don't
- **Don't** use a 1px solid border to separate a sidebar. Use a `surface_dim` background instead.
- **Don't** use standard "drop shadows" (Black 25% opacity). They feel dated and "dirty."
- **Don't** use pure black for text. Always use `on_background` (#1a1b1e) to keep the interface feeling premium and accessible.

---
*Document Ends - Reference Token Set v1.0*```