import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";
import type { Project } from "../types/project";

export function useProject(projectId?: string | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const data = await apiRequest<Project>(`/projects/${projectId}`);

        if (!cancelled) {
          setProject(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load project");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { project, loading, error };
}
