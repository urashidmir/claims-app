import { useCallback, useState } from "react";
import { ProjectForm } from "../components/projects/ProjectForm";
import { ProjectList } from "../components/projects/ProjectList";

export const ProjectsPage = () => {
  const [reloadFlag, setReloadFlag] = useState(0);

  const triggerReload = useCallback(() => {
    setReloadFlag((prev) => prev + 1);
  }, []);

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "1050px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Projects</h2>
      <ProjectForm onCreated={triggerReload} />
      <ProjectList reloadKey={reloadFlag} />
    </div>
  );
};

