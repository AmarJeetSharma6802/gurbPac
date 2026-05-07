"use client";

import UploadForm from "@/components/content/UploadForm";
import DashboardShell from "@/components/layout/DashboardShell";
import ProtectedView from "@/components/layout/ProtectedView";

export default function TeacherUploadPage() {
  return (
    <ProtectedView role="teacher">
      <DashboardShell role="teacher" title="Upload Content" subtitle="Submit a video or poster for principal approval.">
        <UploadForm />
      </DashboardShell>
    </ProtectedView>
  );
}
