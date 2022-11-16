import { breakpoints } from '@data/breakpoints';

export const upFromBreakpoint = (breakpoint: keyof typeof breakpoints): string => {
  return `@media (min-width: ${breakpoints[breakpoint]}px)`;
};

export const upToBreakpoint = (breakpoint: keyof typeof breakpoints): string => {
  return `@media (max-width: ${breakpoints[breakpoint] - 1}px)`;
};
