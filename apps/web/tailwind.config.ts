import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS configuration for BookIt.
 * 
 * Color palette extracted from the Stitch design system (Material Design 3 tonal).
 * Uses the "Precision Architect" creative direction:
 * - Deep navy primary (#002147)
 * - Pristine canvas background (#faf9fd)
 * - Tonal surface hierarchy for depth without borders
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // --- Primary ---
        'primary': '#000a1e',
        'primary-container': '#002147',
        'primary-fixed': '#d6e3ff',
        'primary-fixed-dim': '#aec7f6',
        'on-primary': '#ffffff',
        'on-primary-container': '#708ab5',
        'on-primary-fixed': '#001b3d',
        'on-primary-fixed-variant': '#2d476f',

        // --- Secondary ---
        'secondary': '#5c5f60',
        'secondary-container': '#dee0e2',
        'secondary-fixed': '#e1e2e4',
        'secondary-fixed-dim': '#c5c6c8',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#606365',
        'on-secondary-fixed': '#191c1e',
        'on-secondary-fixed-variant': '#444749',

        // --- Tertiary ---
        'tertiary': '#000d06',
        'tertiary-container': '#002718',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4edea3',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#009c6b',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#005236',

        // --- Error ---
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        // --- Surface / Background ---
        'surface': '#faf9fd',
        'surface-dim': '#dad9dd',
        'surface-bright': '#faf9fd',
        'surface-tint': '#465f88',
        'surface-variant': '#e3e2e6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f4f3f7',
        'surface-container': '#efedf1',
        'surface-container-high': '#e9e7eb',
        'surface-container-highest': '#e3e2e6',
        'background': '#faf9fd',
        'on-surface': '#1a1b1e',
        'on-surface-variant': '#44474e',
        'on-background': '#1a1b1e',

        // --- Outline ---
        'outline': '#74777f',
        'outline-variant': '#c4c6cf',

        // --- Inverse ---
        'inverse-surface': '#2f3033',
        'inverse-on-surface': '#f1f0f4',
        'inverse-primary': '#aec7f6',
      },
      fontFamily: {
        'headline': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
