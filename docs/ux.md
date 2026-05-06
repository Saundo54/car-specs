# UX Specification: CarSpec PWA / Android App

**Project:** CarSpec — Vehicle Specifications Research Application  
**Design System:** Android Material You (Material Design 3)  
**Version:** 1.0  
**Date:** May 2026

---

## 1. Design Philosophy

CarSpec follows the **Material You** design language — the adaptive, expressive evolution of Material Design introduced with Android 12. The app respects the user's personal expression: it reads the system's dynamic colour palette (derived from the user's wallpaper), applies it throughout the UI, and uses large, rounded surfaces with generous typography.

The UX goal is **research clarity**: a user should be able to find a vehicle, read its full spec sheet, and compare it against two others in the fewest possible taps, with zero friction when offline.

**Three design principles:**
1. **Personalised** — Dynamic colour from Material You; dark/light mode automatic
2. **Efficient** — One-handed reachability; persistent filter state; no dead ends
3. **Offline-first** — Offline mode is a first-class experience, not a fallback

---

## 2. Material You Design System

### 2.1 Colour System

Material You uses a **tonal palette** derived from a seed colour. The app's default seed is `#1565C0` (a strong automotive blue), but when running as a TWA on Android 12+, the system wallpaper-derived colour overrides this entirely.

**Colour Roles:**
| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Primary | `#1565C0` | `#90CAF9` | FABs, active states, key actions |
| On Primary | `#FFFFFF` | `#003C8F` | Text/icons on primary |
| Primary Container | `#BBDEFB` | `#1565C0` | Selected chips, nav highlight |
| Secondary | `#455A64` | `#90A4AE` | Secondary actions, labels |
| Surface | `#FAFCFF` | `#111318` | Card backgrounds, sheets |
| Surface Variant | `#DDE3EA` | `#41474D` | Input backgrounds, dividers |
| Tertiary | `#5C6BC0` | `#9FA8DA` | Comparison highlight, badges |
| Error | `#B00020` | `#CF6679` | Validation errors |

**Elevation & Tonal Surface:**
Material You tints surfaces with the primary colour at different opacity levels per elevation:
- Level 0 (background): 0% tint
- Level 1 (cards): 5% primary tint
- Level 2 (nav bar): 8% primary tint
- Level 3 (FAB): 11% primary tint

### 2.2 Typography

Using **Google Fonts** Material You stack:

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display Large | Roboto Flex | 400 | 57sp |
| Display Medium | Roboto Flex | 400 | 45sp |
| Headline Large | Roboto Flex | 400 | 32sp |
| Headline Medium | Roboto Flex | 400 | 28sp |
| Title Large | Roboto Flex | 400 | 22sp |
| Title Medium | Roboto Flex | 500 | 16sp |
| Body Large | Roboto | 400 | 16sp |
| Body Medium | Roboto | 400 | 14sp |
| Label Large | Roboto | 500 | 14sp |
| Label Medium | Roboto | 500 | 12sp |

### 2.3 Shape System

Material You uses expressive, rounded shapes:
| Component | Corner Radius |
|-----------|--------------|
| Extra Small (chips, badges) | 4dp |
| Small (cards, text fields) | 12dp |
| Medium (dialogs, bottom sheets) | 28dp top-only |
| Large (search bar, nav drawer) | 28dp |
| Extra Large (FAB) | 16dp |
| Full (icon buttons, avatar) | 50% |

### 2.4 Motion

Material You motion is **spring-based**, not linear:
- Navigation transitions: shared element + container transform
- Page entry: fade-through (cross-fade + scale from 92%)
- List items: staggered fade-up (20ms delay between items)
- Sheet/dialog: upward slide with spring easing
- FAB: expand-into-screen (extended → icon → page content)

All durations:
- Short: 200ms (micro-interactions)
- Medium: 350ms (page transitions)
- Long: 500ms (complex transitions like comparison reveal)

---

## 3. App Structure & Navigation

### 3.1 Navigation Pattern

**Bottom Navigation Bar** (Material You: NavigationBar) — primary navigation for 3 items:

```
┌─────────────────────────────────────────────┐
│                                             │
│           (content area)                   │
│                                             │
├─────────────────────────────────────────────┤
│  🔍 Search   🔄 Compare    ⭐ Saved         │
└─────────────────────────────────────────────┘
```

- **Search** — Vehicle search & browse (home destination)
- **Compare** — Active comparison view (badge shows count 1–3)
- **Saved** — Bookmarked/favourite vehicles

**Secondary navigation** (within pages) uses tabs or segmented buttons where appropriate (e.g. spec categories on vehicle detail).

### 3.2 Page Map

```
Search (Home)
├── Filter Sheet (bottom sheet)
├── Vehicle List
│   └── Vehicle Detail
│       ├── Specs Tab (Mechanical | Dimensions | Interior | Exterior | Safety | Technology)
│       └── [Add to Compare] → Compare
│
Compare
├── Vehicle Selector (search within compare)
└── Comparison Grid
    └── [Swap Vehicle] → Vehicle Selector
│
Saved
└── Saved Vehicle Detail → Vehicle Detail
│
Settings (via overflow menu in top app bar)
├── Cache Management
├── Appearance (force light/dark)
└── About / Data Sources
```

---

## 4. Screen Designs

### 4.1 Home / Search Screen

```
┌─────────────────────────────────────────────┐
│ CarSpec                          ⋮           │  ← Top App Bar (Medium)
│                                             │     Scrolls away on scroll
│ ┌─────────────────────────────────────────┐ │
│ │ 🔍  Search make, model…                │ │  ← Search Bar (always visible,
│ └─────────────────────────────────────────┘ │     sticky on scroll)
│                                             │
│ [All ▾] [2018–2026 ▾] [SUV ●] [Electric ●] │  ← Filter Chips (horizontal scroll)
│          Active filters shown filled         │     Filled = active filter
│                                             │
│ 2,847 vehicles                    Sort ⬇   │  ← Result count + sort
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Toyota Camry                   2023     │ │
│ │ Ascent Hybrid Sedan                     │ │  ← Vehicle Card (Filled Card)
│ │ Hybrid · FWD · Sedan · ⭐⭐⭐⭐⭐      │ │     Tonal surface elevation 1
│ │                           [Compare +]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Mazda CX-5                     2024     │ │
│ │ G25 Touring                             │ │
│ │ Petrol · AWD · SUV · ⭐⭐⭐⭐⭐        │ │
│ │                           [Compare +]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│   (infinite scroll / pagination)            │
│                                             │
├─────────────────────────────────────────────┤
│  🔍 Search   🔄 Compare ②  ⭐ Saved        │
└─────────────────────────────────────────────┘
```

**Vehicle Card spec:**
- Material You: Filled Card with 12dp corners
- Title: Title Large / Roboto 22sp
- Subtitle: Body Medium / secondary colour
- Chips: fuel type, drivetrain, body type — Label Small chips
- ANCAP: star icons in tertiary colour
- [Compare +] button: Outlined button, becomes filled when added (with haptic feedback)
- Long-press card → context menu: View Detail, Add to Compare, Save

### 4.2 Filter Bottom Sheet

Triggered by the [All ▾] chip or any filter chip:

```
┌─────────────────────────────────────────────┐
│   ▬▬▬▬                                      │  ← Drag handle
│                                             │
│  Filters                        [Reset all] │
│                                             │
│  Body Type                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐  │
│  │ SUV  │ │Sedan │ │Hatch │ │  Wagon   │  │  ← Filter Chips (multi-select)
│  └──────┘ └──────┘ └──────┘ └──────────┘  │
│  ┌──────┐ ┌──────┐                         │
│  │  Ute │ │ Van  │                         │
│  └──────┘ └──────┘                         │
│                                             │
│  Fuel Type                                  │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐ │
│  │ Petrol  │ │ Diesel  │ │   Hybrid     │ │
│  └─────────┘ └─────────┘ └──────────────┘ │
│  ┌──────────┐ ┌──────┐                     │
│  │ Electric │ │ PHEV │                     │
│  └──────────┘ └──────┘                     │
│                                             │
│  Year Range                                 │
│  2018 ●────────────────────────● 2026      │  ← Range Slider
│         2020              2024              │
│                                             │
│  Drivetrain                                 │
│  ○ All  ● FWD  ○ RWD  ○ AWD  ○ 4WD       │  ← Radio buttons
│                                             │
│  Minimum ANCAP Rating                       │
│  ★ ★ ★ ★ ☆   (4 stars)                   │  ← Tap to set minimum
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │        Show 847 vehicles                ││  ← Primary button, count updates live
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### 4.3 Vehicle Detail Screen

```
┌─────────────────────────────────────────────┐
│ ←  Toyota Camry 2023             ⭐  ⋮      │  ← Top App Bar (Small, sticky on scroll)
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │        [Vehicle Hero Image]             │ │  ← 16:9 image, parallax on scroll
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│  Toyota Camry                               │  ← Display Medium
│  Ascent Hybrid Sedan · 2023                 │  ← Title Medium / secondary
│                                             │
│  [🔄 Add to Compare]  [↗ Source]            │  ← Action buttons (outlined)
│                                             │
│  ● Hybrid  ● FWD  ● Sedan  ⭐⭐⭐⭐⭐      │  ← Key fact chips
│                                             │
├─────────────────────────────────────────────┤
│ Mech. │ Dimen. │ Interior │ Safety │ Tech   │  ← Scrollable tab row
├─────────────────────────────────────────────┤
│                                             │
│  ⚙ Mechanical                              │  ← Section header
│                                             │
│  Engine            2.5L 4-cylinder Hybrid   │
│  Power             160 kW (215 hp)          │  ← Spec rows: Label left, value right
│  Torque            221 Nm                   │     Dividers between rows
│  Transmission      CVT                      │     Alternating subtle tonal rows
│  Drivetrain        FWD                      │
│  Fuel consumption  4.2 L/100km (combined)   │
│  CO₂ emissions     96 g/km                  │
│                                             │
│  (swipe tabs or scroll to next section)     │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │  Similar vehicles: Mazda 6 · Honda Accord│ │  ← Related card (Surface Variant)
│ └─────────────────────────────────────────┘ │
│                                             │
├─────────────────────────────────────────────┤
│  🔍 Search   🔄 Compare ①  ⭐ Saved        │
└─────────────────────────────────────────────┘
```

### 4.4 Comparison Screen

```
┌─────────────────────────────────────────────┐
│ ← Compare                       [+ Add]    │
│                                             │
│ ┌──────────────┐┌──────────────┐           │
│ │ Toyota Camry ││  Mazda 6     │ + Add     │  ← Vehicle header cards
│ │ 2023 Hybrid  ││  2023 Atenza │ vehicle   │
│ │      ✕       ││      ✕       │           │
│ └──────────────┘└──────────────┘           │
│                                             │
│ [Show differences only  ○ / ● All specs]   │  ← Toggle switch
│                                             │
├──────────────────┬──────────────────────────┤
│ Mechanical       │                          │  ← Sticky section header
├──────────────────┼────────────┬─────────────┤
│ Engine           │ 2.5L Hybrid│  2.5L Petrol│  ← Spec row
│ Power            │   160 kW   │   140 kW    │  ← Difference highlighted:
│ Torque           │   221 Nm   │   195 Nm    │     higher value = green tint
│ Transmission     │    CVT     │    6-speed  │     different = amber tint
│ Drivetrain       │    FWD     │    FWD      │     same = no highlight
│ Fuel consump.    │  4.2 L/100 │  7.1 L/100  │
│                  │            │             │
├──────────────────┼────────────┼─────────────┤
│ Dimensions       │            │             │
├──────────────────┼────────────┼─────────────┤
│ Length           │  4,885 mm  │  4,805 mm   │
│ Width            │  1,840 mm  │  1,840 mm   │  ← Same value: no highlight
│ Height           │  1,445 mm  │  1,450 mm   │
│ Wheelbase        │  2,825 mm  │  2,830 mm   │
│ Boot capacity    │   524 L    │   480 L     │
│                  │            │             │
│   (scrolls vertically through all sections) │
│                                             │
├─────────────────────────────────────────────┤
│  🔍 Search   🔄 Compare ②  ⭐ Saved        │
└─────────────────────────────────────────────┘
```

**Comparison colour key:**
- No highlight → identical values across all compared vehicles
- Amber `#F9A825` tint → different values (neither is objectively better)
- Green `#2E7D32` tint → numerically superior value (power, boot space, ANCAP)
- Red `#B00020` tint → numerically inferior value (fuel consumption, weight where relevant)

The colour coding logic is spec-aware: for fuel consumption, *lower* is green; for power, *higher* is green.

### 4.5 Offline State

```
┌─────────────────────────────────────────────┐
│ CarSpec                          ⋮           │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📶  You're offline                      │ │  ← Offline banner (surface variant,
│ │  Showing cached data from 3 days ago    │ │     not obtrusive, dismissible)
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🔍  Search make, model…                │ │  ← Search still works (local index)
│ └─────────────────────────────────────────┘ │
│                                             │
│  [All ▾] [2022–2026 ▾] [SUV ●]            │  ← Filters still work
│                                             │
│  Spec detail pages: only cached vehicles    │  ← Uncached vehicle shows
│  can be viewed offline. Browse online to    │     "Not available offline" state
│  cache more vehicles.                       │     with a [View when online] option
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5. Component Specifications

### 5.1 Vehicle Card
- **Type:** Material You Filled Card
- **Elevation:** Level 1 (5% primary tint on surface)
- **Corner radius:** 12dp
- **Padding:** 16dp
- **On hover/focus:** Elevation increases to Level 2 + ripple
- **On press:** Ripple from touch point + navigate to detail
- **Long press:** Context menu bottom sheet

### 5.2 Search Bar
- **Type:** Material You Search Bar (top of screen)
- **Behaviour:** Sticky — does not scroll away
- **Expansion:** Taps to open full-screen search with recent suggestions
- **Corner radius:** 28dp (pill shape)

### 5.3 Filter Chips
- **Type:** Material You Filter Chip
- **Active state:** Filled (primary container colour) with checkmark leading icon
- **Inactive state:** Outlined
- **Layout:** Horizontal scroll row, non-wrapping

### 5.4 Bottom Sheet (Filter)
- **Type:** Modal Bottom Sheet
- **Corner radius:** 28dp top corners
- **Drag handle:** 4dp × 32dp, centred, surface variant colour
- **Max height:** 90% of screen height with scroll

### 5.5 Navigation Bar
- **Type:** Material You Navigation Bar
- **Active indicator:** Pill-shaped, primary container colour
- **Icon style:** Outlined when inactive, filled when active
- **Badge:** On Compare icon, shows vehicle count (1–3)
- **Elevation:** Level 2

### 5.6 Comparison Table
- **Header row:** Sticky, surface container colour
- **Vehicle columns:** Fixed width, horizontally scrollable if 3 vehicles
- **Spec rows:** 48dp height, label in Body Medium, values in Body Large
- **Highlight:** Tonal background colour per comparison state (see 4.4)
- **Section headers:** Non-scrolling section label in Label Large / secondary colour

---

## 6. Accessibility

| Requirement | Implementation |
|------------|---------------|
| Touch target minimum | 48dp × 48dp for all interactive elements |
| Contrast ratio | ≥ 4.5:1 for body text; ≥ 3:1 for large text (WCAG 2.1 AA) |
| Screen reader | All elements labelled with `aria-label` / `role` |
| Dynamic font size | App respects Android text size setting (sp units) |
| Colour-blind accessible | Comparison highlights use both colour AND icon/text indicators |
| Reduced motion | Respects `prefers-reduced-motion`; disables spring animations |
| Keyboard navigation | Full tab order for PWA in desktop/laptop contexts |

---

## 7. Responsive Behaviour

The PWA is designed mobile-first but adapts for tablets:

| Breakpoint | Layout |
|-----------|--------|
| < 600dp (phone) | Single-column, bottom nav, bottom sheets |
| 600–839dp (large phone / small tablet) | Single-column, wider cards, side-anchored sheets |
| ≥ 840dp (tablet) | Two-column (nav rail + content), persistent filter panel, comparison table visible without horizontal scroll |

On tablet, the bottom nav becomes a **Navigation Rail** (left side, vertical) per Material You guidelines.

---

## 8. Empty States & Error States

| State | Illustration | Message | Action |
|-------|-------------|---------|--------|
| No search results | Car silhouette, magnifier | "No vehicles match your filters" | [Adjust filters] |
| Vehicle not cached offline | Cloud with X | "This vehicle isn't available offline. Visit when connected to cache it." | [Dismiss] |
| Spec data unavailable | Info icon | "Full specs not available for this variant yet" | — |
| Scraper data stale | Clock icon | "Data was last updated 95 days ago" | [Refresh] (if online) |
| Compare list full | Warning chip | "You can compare up to 3 vehicles. Remove one to add another." | — |
| Network error | Wave/signal icon | "Couldn't reach CarSpec servers. Showing cached data." | [Retry] |

---

## 9. PWA Manifest

```json
{
  "name": "CarSpec — Vehicle Specifications",
  "short_name": "CarSpec",
  "description": "Research and compare vehicle specifications",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1565C0",
  "background_color": "#111318",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/search.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" },
    { "src": "/screenshots/compare.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ],
  "categories": ["auto", "utilities", "lifestyle"],
  "prefer_related_applications": false
}
```

---

## 10. UX Metrics & Success Criteria

| Metric | Target |
|--------|--------|
| Time to first search result | < 2 seconds (online), < 500ms (offline cached) |
| Time to vehicle detail | < 1 second (cached), < 3 seconds (network) |
| Comparison setup time | < 30 seconds (add 3 vehicles and view) |
| Task completion: find a specific vehicle | ≥ 95% success rate |
| Task completion: compare 2 vehicles | ≥ 90% success rate |
| Lighthouse Performance | ≥ 85 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse PWA | ≥ 90 |
| Lighthouse Best Practices | ≥ 90 |

---

*Document version 1.0 — May 2026*
