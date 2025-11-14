/**
 * Reusable Framer Motion animation variants and utilities
 * for consistent, professional animations across the homepage
 */

import { Variants } from "framer-motion"

// ===== FADE IN ANIMATIONS =====

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth effect
    },
  },
}

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

// ===== SCALE ANIMATIONS =====

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const scaleInSpring: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

// ===== STAGGER CONTAINER =====

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
}

// ===== SLIDE ANIMATIONS =====

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// ===== CARD ANIMATIONS =====

export const cardHover = {
  scale: 1.03,
  y: -8,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
}

export const cardTap = {
  scale: 0.98,
}

// ===== BUTTON ANIMATIONS =====

export const buttonHover = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
}

export const buttonTap = {
  scale: 0.95,
}

// ===== BACKGROUND ANIMATIONS =====

export const backgroundGradient: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: "easeInOut",
    },
  },
}

// ===== REVEAL ANIMATIONS =====

export const revealUp: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const revealWithRotate: Variants = {
  hidden: {
    opacity: 0,
    rotateX: -15,
    y: 50,
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// ===== FLOATING ANIMATIONS =====

export const floatingAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export const floatingAnimationSlow = {
  y: [0, -15, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

// ===== VIEWPORT SETTINGS =====

export const defaultViewport = {
  once: true,
  amount: 0.3,
  margin: "0px 0px -100px 0px",
}

export const viewportSmall = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -50px 0px",
}

export const viewportLarge = {
  once: true,
  amount: 0.4,
  margin: "0px 0px -150px 0px",
}

// ===== UTILITY FUNCTIONS =====

/**
 * Creates a custom delay for animations
 */
export const withDelay = (delay: number, variants: Variants): Variants => {
  return {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        ...(variants.visible as any).transition,
        delay,
      },
    },
  }
}

/**
 * Creates a stagger effect for children
 */
export const createStagger = (staggerDelay: number = 0.1, delayChildren: number = 0.2) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
})
