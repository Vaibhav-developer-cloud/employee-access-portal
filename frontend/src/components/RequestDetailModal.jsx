import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Card,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../constants";
import { formatDate } from "../formatters";

export default function RequestDetailModal({
  open,
  onClose,
  requestId,
  request,
  isAdmin,
  onApprove,
  onReject,
}) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (open && requestId) {
      fetchTimeline();
    }
  }, [open, requestId]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/requests/${requestId}/timeline`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setTimeline(data || []);
      }
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!remarks.trim()) {
      alert("Please add remarks before approving");
      return;
    }
    setActionLoading(true);
    try {
      await onApprove(remarks);
      setRemarks("");
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert("Please add remarks before rejecting");
      return;
    }
    setActionLoading(true);
    try {
      await onReject(remarks);
      setRemarks("");
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        Request Details
      </DialogTitle>

      <DialogContent sx={{ minHeight: 400 }}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Request Information
            </Typography>

            <Card sx={{ p: 2, backgroundColor: "#f5f7fb" }}>
              <Stack spacing={2}>
                {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textSecondary">
                    Request ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    #{request.id}
                  </Typography>
                </Box> */}

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textSecondary">
                    Title
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {request.request_title}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textSecondary">
                    Employee
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {request.employee_name}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textSecondary">
                    Access Type
                  </Typography>
                  <Chip label={request.access_type} size="small" variant="outlined" />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textSecondary">
                    Priority
                  </Typography>
                  <Chip
                    label={request.priority || "MEDIUM"}
                    size="small"
                    color={
                      request.priority === "URGENT"
                        ? "error"
                        : request.priority === "HIGH"
                        ? "warning"
                        : "default"
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={STATUS_LABELS[request.status] || request.status}
                    size="small"
                    sx={{
                      backgroundColor: STATUS_COLORS[request.status],
                      color: "white",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="textSecondary">
                    Created Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(request.created_at)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Request Reason
            </Typography>
            <Card sx={{ p: 2, backgroundColor: "#fafafa", minHeight: 80 }}>
              <Typography variant="body2">{request.reason}</Typography>
            </Card>
          </Box>

          {request.admin_remark && (
            <>
              <Divider />
              <Alert severity="info">{request.admin_remark}</Alert>
            </>
          )}

          {isAdmin && request.status === "PENDING" && (
            <>
              <Divider />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Add Remarks (Required)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={actionLoading}
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        {isAdmin && request.status === "PENDING" && (
          <>
            <Button
              color="error"
              variant="contained"
              onClick={handleReject}
              disabled={!remarks.trim() || actionLoading}
            >
              Reject
            </Button>

            <Button
              color="success"
              variant="contained"
              onClick={handleApprove}
              disabled={!remarks.trim() || actionLoading}
            >
              Approve
            </Button>
          </>
        )}

        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}