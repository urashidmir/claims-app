import { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProject } from "../../hooks/useProject";
import { useCreateClaim } from "../../api/mutations/claims";

export const ClaimForm = () => {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId") ?? undefined;
  const navigate = useNavigate();


  useEffect(() => {
    if (!projectIdFromUrl) navigate("/projects");
  }, [projectIdFromUrl, navigate]);

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectIsError,
    error: projectError,
  } = useProject(projectIdFromUrl);


  const createClaimMutation = useCreateClaim();

  const [form, setForm] = useState({
    claimPeriodStart: "",
    claimPeriodEnd: "",
    amount: "",
  });

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = (status: "Draft" | "Submitted") => {
    if (!project) return;

    createClaimMutation.mutate({
      projectId: project.projectId,
      companyName: project.companyName,
      claimPeriodStart: form.claimPeriodStart,
      claimPeriodEnd: form.claimPeriodEnd,
      amount: Number(form.amount),  
      status,
    }, {
      onSuccess: () => {
        // Reset form after success
        setForm({ claimPeriodStart: "", claimPeriodEnd: "", amount: "" });
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate("Submitted");
  };


  if (projectLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Create New Claim</Typography>
        <Typography mt={2}>Loading project…</Typography>
      </Paper>
    );
  }

  if (projectIsError || !project) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Create New Claim</Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {(projectError as Error)?.message || "Invalid project."}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" mb={2}>
        Create New Claim
      </Typography>


      {createClaimMutation.isSuccess && (
        <Alert severity="success">
          Claim {createClaimMutation.variables?.status === "Draft" ? "saved as draft!" : "submitted successfully!"}
        </Alert>
      )}


      {createClaimMutation.isError && (
        <Alert severity="error">
          {(createClaimMutation.error as Error).message ?? "Failed to create claim."}
        </Alert>
      )}

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
            onClick={() => handleCreate("Draft")}
            variant="outlined"
            disabled={createClaimMutation.isPending}
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={createClaimMutation.isPending}
          >
            {createClaimMutation.isPending ? "Submitting..." : "Submit Claim"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
