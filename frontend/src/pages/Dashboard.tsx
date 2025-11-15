import React from "react";
import { ProjectsPage } from "./ProjectsPage";  
import { ClaimsPage } from "./ClaimsPage";

export const Dashboard = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Claims Management Dashboard</h1>
        <ProjectsPage />
        <ClaimsPage />
    </div>
  );
};