const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const buildUrl = (path) => `${BASE_URL}/api${path}`;

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && data.detail
        ? data.detail
        : "요청 처리 중 오류가 발생했습니다.";

    throw new Error(message);
  }

  return data;
};

export const fetchClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
};
