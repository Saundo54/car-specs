export const SPRING_CONFIGS = {
  standard: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  expressive: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
  fluid: {
    type: 'spring',
    stiffness: 400,
    damping: 40,
  },
} as const;

export const PAGE_TRANSITIONS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: SPRING_CONFIGS.standard,
};

export const ACCORDION_TRANSITIONS = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: SPRING_CONFIGS.standard,
};
