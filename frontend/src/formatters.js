import { STATUS_LABELS } from "./constants";

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
};

export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status;
};

export const getAccessTypeLabel = (accessType) => {
  const labels = {
    VPN: "VPN Access",
    DATABASE: "Database Access",
    ADMIN_PORTAL: "Admin Portal Access",
    SERVER: "Server Access",
  };
  return labels[accessType] || accessType;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
