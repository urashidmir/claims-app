import { Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/project";

interface ProjectRowActionsProps {
  row: Project;
}

export const ProjectRowActions = ({ row }: ProjectRowActionsProps) => {
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
