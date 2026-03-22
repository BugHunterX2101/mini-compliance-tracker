# Design System Strategy: High-End Financial Compliance

## 1. Overview & Creative North Star: "The Architectural Ledger"
This design system moves away from the "flat web" era into a space of **Architectural Clarity**. Our Creative North Star is the concept of an organized, high-end physical workspace—think frosted glass partitions, heavy bond paper, and polished steel. 

We break the "template" look by rejecting the standard 1px border. Instead, we use **Tonal Planes** and **Structural Asymmetry**. High-value compliance data shouldn't feel cluttered; it should feel curated. We utilize extreme typographic scale shifts (Display vs. Label) to create an editorial hierarchy that feels more like a premium financial report than a database.

---

## 2. Colors & Surface Philosophy
The palette is rooted in `on_background` (#131b2e) for authority, but the "soul" of the system lives in the subtle shifts between surface tiers.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. All boundaries are created through background shifts. 
- Use `surface_container_low` (#f2f3ff) for the main page body.
- Use `surface_container_lowest` (#ffffff) for primary content cards.
- Use `surface_bright` (#faf8ff) for sidebars or navigation rails.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers. 
- **Base Layer:** `surface` (#faf8ff)
- **Content Blocks:** `surface_container` (#eaedff)
- **Active Elements:** `surface_container_highest` (#dae2fd)

### The Glass & Gradient Rule
To achieve the "finance-professional" 3D depth, floating elements (modals, dropdowns) must use **Glassmorphism**:
- **Background:** `surface_container_low` at 80% opacity.
- **Backdrop-blur:** `12px` to `20px`.
- **Signature Gradient:** Main CTAs should utilize a subtle linear gradient from `primary` (#000000) to `primary_container` (#001a42) at a 135-degree angle to provide a "machined" satin finish.

---

## 3. Typography: Editorial Authority
We use **Inter** as our typographic engine. The key to the "high-end" feel is the contrast between tight, wide-spaced labels and expansive, fluid headlines.

- **Display-LG (3.5rem):** Reserved for hero metrics (e.g., "98% Compliant"). Tracking: -0.02em.
- **Headline-SM (1.5rem):** Used for section titles. This establishes a "Chapter" feel in the compliance journey.
- **Label-MD (0.75rem):** All-caps with +0.05em tracking for metadata. This provides the "Financial Ledger" aesthetic.
- **Body-MD (0.875rem):** The workhorse. Always use `on_surface_variant` (#45464d) for secondary body text to reduce visual noise.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "dirty" for high-end finance. We use **Ambient Shadows** and **Tonal Lift**.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The difference in hex value creates a "natural" lift.
- **Ambient Shadows:** For floating 3D cards, use a multi-layered shadow:
  - `box-shadow: 0 4px 6px -1px rgba(19, 27, 46, 0.04), 0 10px 15px -3px rgba(19, 27, 46, 0.08);`
  - The shadow color is a tinted version of `on_surface` to mimic natural light.
- **Ghost Borders:** If accessibility requires a stroke, use `outline_variant` (#c6c6cd) at **15% opacity**. This creates a "watermark" effect rather than a hard line.

---

## 5. Components

### Cards & Lists
*   **Card Styling:** Use `xl` (0.75rem) roundedness. No borders. Use `surface_container_lowest` for the fill.
*   **Separation:** Forbid dividers. Use `8` (2rem) or `10` (2.5rem) spacing from the scale to create "rivers" of white space between data sets.

### Buttons
*   **Primary:** Fill with the Signature Gradient. Text is `on_primary` (#ffffff). Shadow lift on hover.
*   **Secondary:** `surface_container_high` (#e2e7ff) fill. Text is `on_secondary_container` (#5c647a).
*   **Tertiary:** No background. Bold `primary` text. `sm` (0.125rem) bottom-border only on hover.

### High-Contrast Badges (Status)
*   **Success:** `on_tertiary_container` (#009668) text on `tertiary_fixed` (#6ffbbe) background.
*   **Critical:** `on_error_container` (#93000a) text on `error_container` (#ffdad6) background.
*   *Note:* Badges use `full` (9999px) roundedness and `label-sm` typography.

### Input Fields
*   **Base State:** `surface_container_highest` fill, no border.
*   **Focus State:** A 2px "Ghost Border" using `surface_tint` (#005ac2) at 40% opacity.
*   **Interaction:** Floating labels that shrink to `label-sm` when active.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use entrance staggers. When a dashboard loads, cards should slide up 10px and fade in with a 50ms delay between each.
*   **DO** use `surface_dim` (#d2d9f4) for inactive states or background "recesses."
*   **DO** prioritize "Breathing Room." If in doubt, increase the spacing to the next tier in the scale.

### Don’t
*   **DON'T** use pure black (#000000) for text. Always use `on_background` (#131b2e) to maintain the navy-tinted premium feel.
*   **DON'T** use 1px dividers to separate list items. Use a slight background toggle between `surface_container_low` and `surface_container_lowest`.
*   **DON'T** use high-saturation backgrounds. The compliance data is the "ink"; the UI is the "paper." Keep surfaces muted.