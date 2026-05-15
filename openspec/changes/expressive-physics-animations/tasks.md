## 1. Setup and Core Configuration

- [x] 1.1 Install `framer-motion` dependency in the `app` directory
- [x] 1.2 Create `app/src/constants/animations.ts` with standardized spring configurations (Standard, Expressive, Fluid)

## 2. Expressive Page Transitions

- [x] 2.1 Wrap the main routes in `app/src/App.tsx` with `AnimatePresence`
- [x] 2.2 Update `app/src/components/layout/AppShell.tsx` to use `motion.div` for the main content area, implementing swipe-in/out transitions keyed by location

## 3. Grouped Browsing and Accordions

- [x] 3.1 Update brand and model list components to support lateral swipe transitions when drilling down or moving back
- [x] 3.2 Refactor alphabetical section headers to use `framer-motion` for smooth, layout-aware expansion of their contents

## 4. Contextual Flow Interactions

- [x] 4.1 Create a hook or utility to capture and store the last interaction (click/touch) coordinates
- [x] 4.2 Implement the model selection grid overlay with a "flow" animation that scales and translates from the captured interaction origin

## 5. Vehicle Search and Bottom Sheets

- [x] 5.1 Implement a physics-based bottom sheet component for the search filters that slides from the base of the viewport
- [x] 5.2 Integrate the bottom sheet into the search screen, ensuring smooth backdrop fade-in/out


## 6. Comparison Bubble Effect

- [x] 6.1 Implement the "bubble" animation using `layoutId` that triggers when a vehicle is added to the comparison list
- [x] 6.2 Ensure the bubble accurately tracks from the "Add" button to the comparison icon in the navigation bar

## 7. Refinement and Validation

- [x] 7.1 Conduct a performance audit to ensure animations maintain 60fps on mobile-equivalent throttling
- [x] 7.2 Fine-tune damping and stiffness values to achieve the desired "Android Expressive" feel
