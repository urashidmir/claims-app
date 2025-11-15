import { useState } from "react";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { apiRequest } from "../../api/apiClient";

interface ProjectFormProps {
  onCreated: () => void;
}

export const ProjectForm = ({ onCreated }: ProjectFormProps) => {
  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!projectName.trim()) return;

    try {
      setLoading(true);

      await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify({ projectName, companyName }),
      });

      setSuccess("Project created successfully!");
      setProjectName("");
      setCompanyName("");


      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Create New Project
      </Typography>

      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mt={2}
        sx={{ width: "100%" }}
      >
        <TextField
          label="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          fullWidth
          required
        />

        {/* Button goes full-width on mobile */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            height: "fit-content",
          }}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </Stack>
    </Paper>
  );
};
