import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  MenuItem,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../services/requestApi";
import EmployeeLayout from "../../layouts/EmployeeLayout";

const ACCESS_TYPES = [
  { value: "VPN", label: "VPN Access" },
  { value: "DATABASE", label: "Database Access" },
  { value: "ADMIN_PORTAL", label: "Admin Portal Access" },
  { value: "SERVER", label: "Server Access" },
];

const PRIORITY_LEVELS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export default function CreateRequest() {
  const [formData, setFormData] = useState({
    request_title: "",
    access_type: "",
    reason: "",
    priority: "MEDIUM",
    employee_name: localStorage.getItem("userId") || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.request_title.trim()) {
      setError("Request Title is required");
      return false;
    }
    if (!formData.access_type) {
      setError("Access Type is required");
      return false;
    }
    if (!formData.reason.trim()) {
      setError("Reason is required");
      return false;
    }
    if (formData.reason.length < 10) {
      setError("Reason must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await createRequest(formData);

      if (response?.success || response?.data) {
        setSuccess("Request created successfully!");
        setTimeout(() => {
          navigate("/employee/requests");
        }, 1500);
      } else {
        setError(response?.message || "Failed to create request");
      }
    } catch (err) {
      setError(err.message || "Failed to create request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeLayout>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Create New Access Request
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
                  {success}
                </Alert>
              )}

              <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                {/* Request Title */}
                <TextField
                  fullWidth
                  label="Request Title"
                  name="request_title"
                  value={formData.request_title}
                  onChange={handleChange}
                  placeholder="e.g., Database Access for Analytics Project"
                  disabled={loading}
                />

                {/* Access Type */}
                <TextField
                  fullWidth
                  select
                  label="Access Type"
                  name="access_type"
                  value={formData.access_type}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {ACCESS_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Priority */}
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {PRIORITY_LEVELS.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Reason */}
                <TextField
                  fullWidth
                  label="Reason for Access"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  multiline
                  rows={5}
                  placeholder="Please provide a detailed reason for this access request..."
                  disabled={loading}
                />

                {/* Employee Name (Read-only) */}
                <TextField
                  fullWidth
                  label="Requested By"
                  value={formData.employee_name}
                  disabled
                />

                {/* Submit Buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/employee/requests")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Card>

            {/* Info Card */}
            <Card sx={{ p: 3, mt: 3, backgroundColor: "#e3f2fd", border: "1px solid #90caf9" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                ℹ️ Information
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your request will be reviewed by an administrator. You can track the status of your request from the "My Requests" page.
              </Typography>
            </Card>
          </Grid>

          {/* Right Side - Instructions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, backgroundColor: "#f5f7fb" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Request Guidelines
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ✓ Be Specific
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Provide a clear title that describes what access you need.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ✓ Explain the Purpose
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Include details about why you need this access and which project/task.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ✓ Set Priority
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Choose the appropriate priority level for your request.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ✓ Review Before Submit
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Double-check all details before submitting your request.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </EmployeeLayout>
  );
}
