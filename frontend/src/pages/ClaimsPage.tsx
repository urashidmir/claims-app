import React, { useState } from "react";
import { ClaimForm } from "../components/claims/ClaimForm";
import { ClaimList } from "../components/claims/ClaimList";

export const ClaimsPage = () => {
  const [reloadKey, setReloadKey] = useState(0);

  const refreshList = () => setReloadKey((k) => k + 1);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Claims</h2>
      <ClaimList reloadKey={reloadKey} />
    </div>
  );
};
