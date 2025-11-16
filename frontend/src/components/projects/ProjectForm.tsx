import { useState } from "react";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useCreateProject } from "../../api/mutations/projects";

interface ProjectFormProps {
  onCreated: () => void;
}

export const ProjectForm = ({ onCreated }: ProjectFormProps) => {
  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const createProject = useCreateProject();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) return;

    createProject.mutate(
      { projectName, companyName },
      {
        onSuccess: () => {
          setProjectName("");
          setCompanyName("");
          onCreated();
        },
      }
    );
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Create New Project
      </Typography>

      {createProject.isSuccess && (
        <Alert severity="success">Project created successfully!</Alert>
      )}

      {createProject.isError && (
        <Alert severity="error">
          {(createProject.error as Error).message}
        </Alert>
      )}

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

        <Button
          type="submit"
          variant="contained"
          disabled={createProject.isPending}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            height: "fit-content",
          }}
        >
          {createProject.isPending ? "Creating..." : "Create"}
        </Button>
      </Stack>
    </Paper>
  );
};
