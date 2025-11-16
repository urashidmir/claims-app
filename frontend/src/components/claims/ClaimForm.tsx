import { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { apiRequest } from "../../api/apiClient";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useProject } from "../../hooks/useProject";

export const ClaimForm = () => {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");
  const navigate = useNavigate();

  const { project, loading: projectLoading, error: projectError } =
    useProject(projectIdFromUrl);

  const [form, setForm] = useState({
    claimPeriodStart: "",
    claimPeriodEnd: "",
    amount: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (!projectIdFromUrl) {
      navigate("/projects");
    }
  }, [projectIdFromUrl, navigate]);


  useEffect(() => {
    if (projectError) setError(projectError);
  }, [projectError]);

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createClaim = async (status: "Draft" | "Submitted") => {
    setError("");
    setSuccess("");

    if (!project) {
      setError("Invalid project selected.");
      return;
    }

    try {
      setSubmitLoading(true);

      await apiRequest("/claims", {
        method: "POST",
        body: JSON.stringify({
          projectId: project.projectId,
          companyName: project.companyName,
          claimPeriodStart: form.claimPeriodStart || null,
          claimPeriodEnd: form.claimPeriodEnd || null,
          amount: form.amount ? Number(form.amount) : null,
          status,
        }),
      });

      setSuccess(
        status === "Draft"
          ? "Draft saved!"
          : "Claim submitted successfully!"
      );

      setForm({
        claimPeriodStart: "",
        claimPeriodEnd: "",
        amount: "",
      });
    } catch (err: unknown) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to create claim.",
          );
    } finally {
      setSubmitLoading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createClaim("Submitted");
  };

  if (projectLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Create New Claim</Typography>
        <Typography mt={2}>Loading project…</Typography>
      </Paper>
    );
  }

  if (!project) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Create New Claim</Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || "Invalid project."}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper component="form" onSubmit={submit} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" mb={2}>
        Create New Claim
      </Typography>

      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2} mt={2}>
        <TextField
          label="Project"
          value={project.projectName}
          fullWidth
          disabled
        />

        <TextField
          label="Company Name"
          value={project.companyName}
          fullWidth
          disabled
        />

        <TextField
          label="Claim Period Start"
          name="claimPeriodStart"
          type="date"
          value={form.claimPeriodStart}
          onChange={updateField}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />

        <TextField
          label="Claim Period End"
          name="claimPeriodEnd"
          type="date"
          value={form.claimPeriodEnd}
          onChange={updateField}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />

        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={updateField}
          fullWidth
          required
        />
         <Stack direction="row" spacing={2}>
          <Button 
            onClick={() => createClaim("Draft")}
            variant="outlined" 
            disabled={submitLoading}>
            Save as Draft
          </Button>

          <Button type="submit" variant="contained" disabled={submitLoading}>
            {submitLoading ? "Submitting..." : "Submit Claim"}
          </Button>
         </Stack>
      </Stack>
    </Paper>
  );
};
