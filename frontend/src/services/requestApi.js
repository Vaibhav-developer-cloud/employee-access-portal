import { API } from "./config";
import { authHeader } from "./authHeader";

export const getRequests = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  
  const url = queryParams.toString() 
    ? `${API}/requests?${queryParams.toString()}` 
    : `${API}/requests`;
  
  const res = await fetch(url, {
    headers: authHeader(),
  });

  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
};

export const updateRequest = async (id, data) => {
  const res = await fetch(`${API}/requests/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const createRequest = async (data) => {
  const res = await fetch(`${API}/requests`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  return res.json();
};