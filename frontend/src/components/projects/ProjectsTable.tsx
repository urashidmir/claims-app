import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { Project } from "../../types/project";
import { ProjectRowActions } from "./ProjectRowActions";

const columns: GridColDef<Project>[] = [
  { field: "projectName", headerName: "Project Name", flex: 1 },
  { field: "companyName", headerName: "Company Name", flex: 1 },
  { field: "createdAt", headerName: "Created At", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    renderCell: (params) => <ProjectRowActions row={params.row} />,
  },
];

export const ProjectTable = ({
  rows,
  loading,
}: {
  rows: Project[];
  loading: boolean;
}) => (
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
      loading={loading}
      sx={{
        ".MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
      }}
    />
  </Box>
);
