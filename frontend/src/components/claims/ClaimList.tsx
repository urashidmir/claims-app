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
import type { Claim } from "../../types/claim";
import { useSearchParams } from "react-router-dom";
import { useProject } from "../../hooks/useProject";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiRequest } from "../../api/apiClient";

export function ClaimList() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") ?? undefined;

  const queryClient = useQueryClient();


  const {
    data: project,
    isLoading: projectLoading,
    isError: projectIsError,
    error: projectError,
  } = useProject(projectId);

  const {
    data: rows = [],
    isLoading: claimsLoading,
    isError: claimsIsError,
    error: claimsError,
  } = useQuery<Claim[], Error>({
    queryKey: ["claims", projectId],
    queryFn: () => {
      const endpoint = projectId
        ? `/claims?projectId=${projectId}`
        : "/claims";
      return apiRequest<Claim[]>(endpoint);
    },
  });


  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Claim["status"];
    }) =>
      apiRequest<Claim>(`/claims/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    onSuccess: (updatedClaim) => {
      queryClient.invalidateQueries({
        queryKey: ["claims", updatedClaim.projectId],
      });


      queryClient.invalidateQueries({
        queryKey: ["claim", updatedClaim.claimId],
      });
    },
  });


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
            updateStatusMutation.mutate({
              id: params.row.claimId,
              status: e.target.value as Claim["status"],
            })
          }
        >
          <MenuItem value="Draft">Draft</MenuItem>
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

  const isBusy =
    claimsLoading || projectLoading || updateStatusMutation.isPending;


  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>

      {projectIsError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {(projectError as Error).message ??
            "Failed to load project."}
        </Alert>
      )}

      {claimsIsError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {(claimsError as Error).message ?? "Failed to load claims."}
        </Alert>
      )}

      {updateStatusMutation.isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {(updateStatusMutation.error as Error).message ??
            "Failed to update claim status."}
        </Alert>
      )}

      {isBusy && <CircularProgress size={28} sx={{ mb: 2 }} />}

      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.claimId}
          disableRowSelectionOnClick
          loading={isBusy}
          sx={{
            ".MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          }}
        />
      </div>
    </Paper>
  );
}
