import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Paper, Typography, CircularProgress, Alert, Stack, Button, Box } from "@mui/material";
import { apiRequest } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/project";


interface ProjectListProps {
  reloadKey: number;
}

const columns: GridColDef<Project>[] = [
  { field: "projectName", headerName: "Project Name", flex: 1 },
  { field: "companyName", headerName: "Company Name", flex: 1 },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    //valueGetter: (params) => new Date(params.row.createdAt).toLocaleString(),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <ActionButtons row={params.row} />
    ),
  },
];

const ActionButtons = ({ row }: { row: Project }) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate(`/claims?projectId=${row.projectId}`)}
      >
        View Claims
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={() => navigate(`/claims/new?projectId=${row.projectId}`)}
      >
        Add Claim
      </Button>
    </Stack>
  );
};


export function ProjectList({ reloadKey }: ProjectListProps) {
  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest<Project[]>("/projects");
      setRows(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [reloadKey]);

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" mb={2}>
        Projects
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress size={28} sx={{ mb: 2 }} />}

      <Box
        sx={{
          width: "100%",
          height: { xs: 380, sm: 420 },
          overflowX: "auto", // horizontal scroll on tiny screens
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.projectId}
          loading={loading}
          disableRowSelectionOnClick
          sx={{
            ".MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          }}
        />
      </Box>
    </Paper>
  );
}
