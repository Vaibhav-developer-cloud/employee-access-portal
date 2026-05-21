import { API } from "./config";
import { authHeader } from "./authHeader";

// GET ANALYTICS STATUS COUNT
export const getStatusCount = async () => {
  try {
    const res = await fetch(`${API}/analytics/status-count`, {
      headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to fetch status count");
    return res.json();
  } catch (error) {
    console.error("Error fetching status count:", error);
    throw error;
  }
};

// GET ANALYTICS ACCESS TYPES
export const getAccessTypes = async () => {
  try {
    const res = await fetch(`${API}/analytics/access-types`, {
      headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to fetch access types");
    return res.json();
  } catch (error) {
    console.error("Error fetching access types:", error);
    throw error;
  }
};
