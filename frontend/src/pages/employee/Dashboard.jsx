import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { getRequests } from "../../services/requestApi";
import AddIcon from "@mui/icons-material/Add";

export default function EmployeeDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRequests();
      setData(res?.data?.requests || []);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = data.length;
  const pending = data.filter((r) => r.status === "PENDING").length;
  const approved = data.filter((r) => r.status === "APPROVED").length;
  const rejected = data.filter((r) => r.status === "REJECTED").length;

  if (loading) {
    return (
      <EmployeeLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress />
        </Box>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome, {localStorage.getItem("userId")}!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your access requests and track their status
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                backgroundColor: "#f5f7fb",
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Total Requests
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#667eea" }}>
                {total}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                backgroundColor: "#fff3e0",
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Pending
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#ff9800" }}>
                {pending}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                backgroundColor: "#e8f5e9",
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Approved
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#4caf50" }}>
                {approved}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                backgroundColor: "#ffebee",
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Rejected
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#f44336" }}>
                {rejected}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
            onClick={() => navigate("/employee/create")}
          >
            Create New Request
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/employee/requests")}
          >
            View All Requests
          </Button>
        </Stack>

        {/* Quick Info */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, backgroundColor: "#e3f2fd", border: "1px solid #90caf9" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Quick Information
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  ✓ You have <strong>{pending}</strong> pending request{pending !== 1 ? "s" : ""}
                </Typography>
                <Typography variant="body2">
                  ✓ You have <strong>{approved}</strong> approved request{approved !== 1 ? "s" : ""}
                </Typography>
                {/* <Typography variant="body2">
                  ✓ Admins review requests regularly. Please add detailed reasons for faster processing.
                </Typography> */}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </EmployeeLayout>
  );
}