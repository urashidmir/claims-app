import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1256D8" },
    secondary: { main: "#0AA06E" },
  },
  shape: { borderRadius: 12 },
  typography: {
    h6: {
      fontSize: "1.1rem",
      "@media (max-width:600px)": {
        fontSize: "0.95rem",
      },
    },
  },
});
