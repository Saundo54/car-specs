## Context

The car-specs app is a React 19 application using Material Web components. Currently, it has no formal animation system. Navigation is instantaneous, and UI elements appear/disappear without transitions. The user wants to implement "Expressive" animations similar to Android's design system, which emphasizes physics-based motion (springs) over duration-based easing.

## Goals / Non-Goals

**Goals:**
- Establish a reusable animation system using Framer Motion.
- Implement specific "expressive" patterns: swiping page transitions, flowing grids, and interactive bubbles.
- Ensure animations are performance-optimized (60fps+) and don't block user interaction.
- Align with Android's "Expressive" motion guidelines (spring-heavy, bouncy but purposeful).

**Non-Goals:**
- Creating a custom animation engine from scratch.
- Animating every single UI element (focus is on major transitions and interaction feedback).
- Implementing complex 3D animations or canvas-based effects.

## Decisions

### 1. Animation Library: Framer Motion
- **Choice**: Framer Motion.
- **Rationale**: Best-in-class support for React 19, declarative API, and powerful `layout` animations. It handles physics (springs) natively and provides `AnimatePresence` for exit animations, which are crucial for page transitions.
- **Alternatives**: GSAP (powerful but more imperative and larger bundle size), CSS Transitions (limited physics control, difficult to orchestrate).

### 2. Spring-based Motion Curves
- **Choice**: Use `type: "spring"` for almost all transitions.
- **Rationale**: To match "Android Expressive", we need motion that feels organic. 
  - *Standard*: `stiffness: 300, damping: 30` (snappy, minimal bounce).
  - *Expressive*: `stiffness: 200, damping: 20` (more playful bounce for the "bubble" effect).
  - *Fluid*: `stiffness: 400, damping: 40` (very fast for page swipes).

### 3. Coordinate-Origin Overlay (The "Flow" Grid)
- **Approach**: Capture `clientX` and `clientY` from the click event that triggers the model grid. Pass these as `custom` props to the Framer Motion component.
- **Implementation**: The grid will use `initial={{ scale: 0, x: originX, y: originY, opacity: 0 }}` and `animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}`.

### 4. Shared Layout for "Compare Bubble"
- **Approach**: Use `layoutId` to animate the vehicle image from the "Add to Compare" button location to the floating compare button in the navigation bar.
- **Implementation**: A temporary "clone" of the image will be created in an `AnimatePresence` block, keyed to the specific vehicle being added.

## Risks / Trade-offs

- **[Risk] Animation Jitter on Low-end Devices** → **Mitigation**: Use `transform` and `opacity` only. Enable `layout` prop carefully to avoid expensive layout recalculations.
- **[Risk] Interaction Latency** → **Mitigation**: Ensure all animations are "interruptible" (Framer Motion handles this by default) and keep transition durations snappy (typically < 300ms).
- **[Risk] Bundle Size** → **Mitigation**: Use `m` (mini) version of Framer Motion or ensure tree-shaking is working correctly.
