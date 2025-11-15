import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
} from "@mui/material";
import { apiRequest } from "../../api/apiClient";
import type { Claim } from "../../types/claim";
import { useSearchParams } from "react-router-dom";
import { useProject } from "../../hooks/useProject"; // ⬅️ adjust path if needed

interface ClaimListProps {
  reloadKey: number;
}

export function ClaimList({ reloadKey }: ClaimListProps) {
  const [rows, setRows] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  // 🔥 Get project details when projectId is present
  const {
    project,
    loading: projectLoading,
    error: projectError,
  } = useProject(projectId);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = projectId
        ? `/claims?projectId=${projectId}`
        : "/claims";

      const data = await apiRequest<Claim[]>(endpoint);
      setRows(data);
    } catch (err: any) {
      setError(err.message || "Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [reloadKey, projectId]);

  const updateStatus = async (id: string, status: Claim["status"]) => {
    try {
      await apiRequest(`/claims/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      load();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const columns: GridColDef<Claim>[] = [
    { field: "companyName", headerName: "Company", flex: 1 },
    { field: "projectName", headerName: "Project", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.row.status}
          onChange={(e) =>
            updateStatus(params.row.claimId, e.target.value as Claim["status"])
          }
        >
          <MenuItem value="Submitted">Submitted</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      ),
    },
    { field: "claimPeriodStart", headerName: "Period Start", flex: 1 },
    { field: "claimPeriodEnd", headerName: "Period End", flex: 1 },
    { field: "createdAt", headerName: "Created", flex: 1 },
  ];

  const title = projectId
    ? projectLoading
      ? "Claims for project…"
      : project
      ? `Claims for ${project.projectName}`
      : "Claims for selected project"
    : "All Claims";

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>

      {/* Project-level error (e.g. project not found) */}
      {projectError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {projectError}
        </Alert>
      )}

      {/* Claims-level error */}
      {error && <Alert severity="error">{error}</Alert>}

      {(loading || projectLoading) && (
        <CircularProgress size={28} sx={{ mb: 2 }} />
      )}

      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.claimId}
          disableRowSelectionOnClick
          sx={{
            ".MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          }}
        />
      </div>
    </Paper>
  );
}
