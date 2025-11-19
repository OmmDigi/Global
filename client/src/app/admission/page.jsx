import React, { Suspense } from "react";
import AdmissionPage from "./AdmissionPage";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdmissionPage />
    </Suspense>
  );
}
