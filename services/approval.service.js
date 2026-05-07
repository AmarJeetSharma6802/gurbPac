const APPROVAL_PATH = "/api/controllers/content/verify-video";

async function request(body) {
  const response = await fetch(APPROVAL_PATH, {
    method: "PUT",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Approval request failed");
  return data;
}

export const approvalService = {
  approve(contentId) {
    return request({ contentId, status: "approved" });
  },

  reject(contentId, rejectionReason) {
    return request({ contentId, status: "rejected", rejectionReason });
  },
};
