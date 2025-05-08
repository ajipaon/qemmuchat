import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  colors: {
    // Neobrutalism bold colors
    primary: [
      "#FFE766",
      "#FFE04D",
      "#FFD833",
      "#FFD11A",
      "#FFCB00",
      "#E6B700",
      "#CCA300",
      "#B28F00",
      "#997B00",
      "#806700",
    ],
    secondary: [
      "#FF6B6B",
      "#FF5252",
      "#FF3838",
      "#FF1F1F",
      "#FF0505",
      "#E60000",
      "#CC0000",
      "#B20000",
      "#990000",
      "#800000",
    ],
  },

  shadows: {
    xs: "4px 4px 0 rgba(0, 0, 0, .95)",
    sm: "5px 5px 0 rgba(0, 0, 0, .95)",
    md: "6px 6px 0 rgba(0, 0, 0, .95)",
    lg: "8px 8px 0 rgba(0, 0, 0, .95)",
    xl: "10px 10px 0 rgba(0, 0, 0, .95)",
  },

  headings: {
    fontFamily: "Space Grotesk, sans-serif",
    sizes: {
      h1: { fontSize: rem(36) },
      h2: { fontSize: rem(30) },
      h3: { fontSize: rem(24) },
      h4: { fontSize: rem(20) },
      h5: { fontSize: rem(16) },
      h6: { fontSize: rem(14) },
    },
  },

  defaultRadius: "0",

  components: {
    Button: {
      styles: (theme) => ({
        root: {
          border: "3px solid black",
          borderRadius: "0",
          background: theme.colors.primary[4],
          color: "black",
          fontWeight: 700,
          "&:hover": {
            transform: "translate(-2px, -2px)",
            boxShadow: "4px 4px 0 rgba(0, 0, 0, .95)",
          },
        },
      }),
    },
    Card: {
      styles: {
        root: {
          border: "3px solid black",
          borderRadius: "0",
        },
      },
    },
    Input: {
      styles: {
        input: {
          border: "3px solid black",
          borderRadius: "0",
          "&:focus": {
            border: "3px solid black",
          },
        },
      },
    },
    Paper: {
      styles: {
        root: {
          border: "3px solid black",
          borderRadius: "0",
        },
      },
    },
  },
});
