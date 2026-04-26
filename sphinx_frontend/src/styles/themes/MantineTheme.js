/**
 * theme.ts
 * Production-ready Mantine v7 theme configuration
 * Supports light & dark color schemes with a professional green palette.
 *
 * Usage:
 *   import { theme } from './theme';
 *   <MantineProvider theme={theme} defaultColorScheme="light">
 *     <App />
 *   </MantineProvider>
 */

import {
  createTheme,
  DEFAULT_THEME,
  mergeMantineTheme,
  virtualColor,
} from "@mantine/core";

// ─────────────────────────────────────────────
// 1. CUSTOM COLOR PALETTES  (10 shades each)
// ─────────────────────────────────────────────

/**
 * Forest Green — primary brand color.
 * Rich, professional green from soft mint (index 0) to deep forest (index 9).
 */
const forestGreen = [
  "#edfaf3", // 0 – near-white tint
  "#d2f3e3", // 1 – very light
  "#a4e6c7", // 2 – light
  "#72d9a9", // 3 – soft
  "#45cc8e", // 4 – medium-light
  "#25bf78", // 5 – medium  ← icons / badges
  "#1aad69", // 6 – primary  ← DEFAULT shade
  "#138f55", // 7 – deep
  "#0d7244", // 8 – darker
  "#085733", // 9 – darkest
];

/**
 * Sage — muted secondary green for surfaces and accents.
 */
const sage = [
  "#f4f8f5", // 0
  "#e3ede6", // 1
  "#c4d9c9", // 2
  "#a1c4a9", // 3
  "#7faf8a", // 4
  "#619a6e", // 5
  "#4d8a5a", // 6 ← DEFAULT
  "#3d7249", // 7
  "#2e5b39", // 8
  "#1f4229", // 9
];

/**
 * Slate — neutral dark palette for text, backgrounds, borders.
 */
const slate = [
  "#f8f9fa", // 0 – lightest
  "#f1f3f5", // 1
  "#e9ecef", // 2
  "#dee2e6", // 3
  "#ced4da", // 4
  "#adb5bd", // 5
  "#6c757d", // 6
  "#495057", // 7
  "#343a40", // 8
  "#212529", // 9 – darkest
];

/**
 * Amber — warm accent for warnings, highlights, CTAs.
 */
const amber = [
  "#fff9e6", // 0
  "#ffedb3", // 1
  "#ffe180", // 2
  "#ffd44d", // 3
  "#ffc71a", // 4
  "#e6ae00", // 5
  "#cc9a00", // 6 ← DEFAULT
  "#b38600", // 7
  "#996e00", // 8
  "#7a5800", // 9
];

/**
 * Crimson — danger / error color.
 */
const crimson = [
  "#fff0f0", // 0
  "#ffd9d9", // 1
  "#ffb3b3", // 2
  "#ff8080", // 3
  "#ff4d4d", // 4
  "#e63333", // 5
  "#cc1a1a", // 6 ← DEFAULT
  "#b30d0d", // 7
  "#990000", // 8
  "#7a0000", // 9
];

// ─────────────────────────────────────────────
// 3. THEME OVERRIDE OBJECT
// ─────────────────────────────────────────────

const themeOverride = createTheme({
  // ── Identity ─────────────────────────────
  primaryColor: "forestGreen",
  primaryShade: { light: 6, dark: 5 },

  // ── Colors ───────────────────────────────
  colors: {
    forestGreen,
    sage,
    slate,
    amber,
    crimson,

    // Virtual color: resolves to forestGreen (light) or sage (dark)
    primary: virtualColor({
      name: "primary",
      light: "forestGreen",
      dark: "sage",
    }),
  },

  white: "#ffffff",
  black: "#1a1a1a",

  // ── Auto-contrast ─────────────────────────
  autoContrast: true,
  luminanceThreshold: 0.35,

  // ── Typography ───────────────────────────
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    '"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
  fontSmoothingEnabled: true,

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },

  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55",
    lg: "1.6",
    xl: "1.65",
  },

  fontWeights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  headings: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "2.25rem", lineHeight: "1.2" },
      h2: { fontSize: "1.875rem", lineHeight: "1.25" },
      h3: { fontSize: "1.5rem", lineHeight: "1.3" },
      h4: { fontSize: "1.25rem", lineHeight: "1.35" },
      h5: { fontSize: "1.125rem", lineHeight: "1.4" },
      h6: { fontSize: "1rem", lineHeight: "1.45" },
    },
  },

  // ── Spacing ──────────────────────────────
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  // ── Radius ───────────────────────────────
  radius: {
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  defaultRadius: "md",

  // ── Shadows ──────────────────────────────
  shadows: {
    xs: "0 1px 2px rgba(0,0,0,0.06)",
    sm: "0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)",
    lg: "0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)",
    xl: "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
  },

  // ── Breakpoints ──────────────────────────
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "80em",
    xl: "96em",
  },

  // ── Misc ─────────────────────────────────
  focusRing: "auto",
  cursorType: "pointer",
  defaultGradient: { from: "forestGreen.5", to: "forestGreen.8", deg: 135 },

  // ─────────────────────────────────────────
  // 4. COMPONENT DEFAULTS
  // ─────────────────────────────────────────
  components: {
    Button: {
      defaultProps: { radius: "md", fw: 600 },
      styles: {
        root: {
          letterSpacing: "0.01em",
          transition:
            "background-color 150ms ease, transform 80ms ease, box-shadow 150ms ease",
          "&:active": { transform: "translateY(1px)" },
        },
      },
    },

    TextInput: { defaultProps: { radius: "md" } },
    PasswordInput: { defaultProps: { radius: "md" } },
    Textarea: { defaultProps: { radius: "md" } },
    Select: { defaultProps: { radius: "md" } },
    MultiSelect: { defaultProps: { radius: "md" } },
    NumberInput: { defaultProps: { radius: "md" } },

    Card: {
      defaultProps: {
        radius: "lg",
        shadow: "sm",
        padding: "lg",
        withBorder: true,
      },
    },

    Badge: {
      defaultProps: { radius: "sm", variant: "light" },
    },

    Paper: {
      defaultProps: { radius: "md", shadow: "xs", p: "md", withBorder: true },
    },

    Notification: { defaultProps: { radius: "md" } },

    Alert: { defaultProps: { radius: "md", variant: "light" } },

    Modal: {
      defaultProps: {
        radius: "lg",
        centered: true,
        shadow: "xl",
        overlayProps: { blur: 3, opacity: 0.4 },
      },
    },

    Drawer: {
      defaultProps: {
        shadow: "lg",
        overlayProps: { blur: 2, opacity: 0.35 },
      },
    },

    Tooltip: {
      defaultProps: {
        radius: "sm",
        withArrow: true,
        arrowSize: 6,
        transitionProps: { duration: 120 },
      },
    },

    Popover: {
      defaultProps: {
        radius: "md",
        shadow: "md",
        withArrow: true,
        arrowSize: 8,
      },
    },

    Avatar: {
      defaultProps: { radius: "xl", color: "forestGreen", variant: "filled" },
    },

    ActionIcon: { defaultProps: { radius: "md", variant: "subtle" } },

    Tabs: { defaultProps: { radius: "md" } },

    Loader: { defaultProps: { color: "forestGreen", size: "md" } },

    Progress: {
      defaultProps: { color: "forestGreen", radius: "xl", size: "sm" },
    },

    Switch: { defaultProps: { color: "forestGreen" } },
    Checkbox: { defaultProps: { color: "forestGreen", radius: "sm" } },
    Radio: { defaultProps: { color: "forestGreen" } },
    Slider: { defaultProps: { color: "forestGreen", radius: "xl" } },

    Table: {
      defaultProps: {
        striped: "odd",
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
        verticalSpacing: "sm",
        horizontalSpacing: "md",
      },
    },

    Anchor: {
      defaultProps: { c: "forestGreen.6", underline: "hover" },
    },
  },

  // ─────────────────────────────────────────
  // 5. DESIGN TOKENS  (theme.other)
  //    Access via: useMantineTheme().other.xxx
  // ─────────────────────────────────────────
  other: {
    semanticColors: {
      success: "forestGreen.6",
      warning: "amber.6",
      error: "crimson.6",
      info: "blue.6",
      neutral: "slate.5",
    },

    zIndex: {
      modal: 200,
      overlay: 150,
      dropdown: 100,
      sticky: 50,
      base: 0,
    },

    transitions: {
      fast: "100ms ease",
      base: "200ms ease",
      slow: "350ms ease",
      spring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
    },

    surfaces: {
      light: {
        page: "#f8f9fa",
        card: "#ffffff",
        overlay: "rgba(255,255,255,0.85)",
        border: "#dee2e6",
      },
      dark: {
        page: "#141414",
        card: "#1e1e1e",
        overlay: "rgba(20,20,20,0.85)",
        border: "#2c2c2c",
      },
    },

    brand: {
      name: "MyApp",
      primaryHex: "#1aad69", // forestGreen[6]
      accentHex: "#25bf78", // forestGreen[5]
    },
  },
});

// ─────────────────────────────────────────────
// 6. MERGED THEME
//    Use this when you need the full theme object
//    outside of React components (SSR, utils, etc.)
// ─────────────────────────────────────────────
export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
export { themeOverride };
