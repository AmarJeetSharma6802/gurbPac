const CONTENT_PATH = "/api/controllers/content";

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Content request failed");
  return data;
}

function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.findContent)) return value.findContent;
  if (Array.isArray(value?.content)) return value.content;
  return [];
}

export const contentService = {
  async list() {
    const response = await fetch(CONTENT_PATH, {
      credentials: "include",
      cache: "no-store",
    });
    const payload = await readResponse(response);
    return safeArray(payload);
  },

  async getBySlug(slug) {
    const response = await fetch(`${CONTENT_PATH}/${slug}`, {
      credentials: "include",
      cache: "no-store",
    });
    const payload = await readResponse(response);
    return payload?.content || null;
  },

  upload(formValues) {
    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("subject", formValues.subject);
    formData.append("description", formValues.description || "No description added");
    formData.append("video", formValues.file);

    return fetch(CONTENT_PATH, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then(readResponse);
  },
};
