import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../api/queries/projects";
import { ProjectTable } from "./ProjectsTable";

interface ProjectListProps {
  reloadKey: number;
}

export const ProjectList = ({ reloadKey }: ProjectListProps) => {
  const { data: rows = [], isLoading, isError, error } = useQuery({
    queryKey: ["projects", reloadKey],
    queryFn: fetchProjects,
  });

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" mb={2}>Projects</Typography>

      {isError && <Alert severity="error">{(error as Error).message}</Alert>}
      {isLoading && <CircularProgress size={28} sx={{ mb: 2 }} />}

      <ProjectTable rows={rows} loading={isLoading} />
    </Paper>
  );
};
