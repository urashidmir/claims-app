import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button } from "@mui/material";
import { Link, Route, Routes, BrowserRouter } from "react-router-dom";
import { theme } from "./theme";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ClaimsPage } from "./pages/ClaimsPage";
import { ClaimForm } from "./components/claims/ClaimForm";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="sticky" color="primary">
          <Toolbar
            sx={{
              flexDirection: "column",          // title on top, buttons below
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Title on its own row */}
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Claims Tracker Portal
            </Typography>

            {/* Nav buttons row */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Button component={Link} to="/projects" color="inherit">
                Projects
              </Button>
              <Button component={Link} to="/claims" color="inherit">
                Claims
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
            <Routes>
              <Route path="/" element={<ProjectsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/claims" element={<ClaimsPage />} />
              <Route path="/claims/new" element={<ClaimForm />} />
            </Routes>
          </Box>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

