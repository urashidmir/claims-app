import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/project";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../api/queries/projects";

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
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    renderCell: (params) => <ActionButtons row={params.row} />,
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
  const {
    data: rows = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects", reloadKey],
    queryFn: fetchProjects,
  });

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" mb={2}>
        Projects
      </Typography>

      {isError && (
        <Alert severity="error">{(error as Error).message}</Alert>
      )}

      {isLoading && <CircularProgress size={28} sx={{ mb: 2 }} />}

      <Box
        sx={{
          width: "100%",
          height: { xs: 380, sm: 420 },
          overflowX: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.projectId}
          disableRowSelectionOnClick
          loading={isLoading}
          sx={{
            ".MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          }}
        />
      </Box>
    </Paper>
  );
}
