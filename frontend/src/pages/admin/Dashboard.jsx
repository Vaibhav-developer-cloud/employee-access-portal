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
import AdminLayout from "../../layouts/AdminLayout";
import { getRequests } from "../../services/requestApi";
import { getStatusCount, getAccessTypes } from "../../services/analyticsApi";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [accessData, setAccessData] = useState([]);
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
      const reqRes = await getRequests();
      setRequests(reqRes?.data?.requests || []);

      const statusRes = await getStatusCount();
      setStatusData(statusRes);

      const accessRes = await getAccessTypes();
      setAccessData(Array.isArray(accessRes) ? accessRes : []);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pending = statusData?.pending || 0;
  const approved = statusData?.approved || 0;
  const rejected = statusData?.rejected || 0;
  const total = pending + approved + rejected;

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Overview of all access requests and system statistics
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Key Stats */}
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
                Pending Review
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

        {/* Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📋 Review Requests
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Review and approve/reject pending access requests from employees
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    textTransform: "none",
                    fontWeight: 600,
                    alignSelf: "flex-start",
                  }}
                  onClick={() => navigate("/admin/requests")}
                >
                  View All Requests
                </Button>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📊 Analytics
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View detailed analytics about request trends and distributions
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    textTransform: "none",
                    fontWeight: 600,
                    alignSelf: "flex-start",
                  }}
                  onClick={() => navigate("/admin/analytics")}
                >
                  Go to Analytics
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Top Access Types */}
        {accessData.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Top Access Types Requested
                </Typography>
                <Grid container spacing={2}>
                  {accessData.slice(0, 4).map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: "center",
                          backgroundColor: "#f5f7fb",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          {item.accessType}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#667eea" }}>
                          {item.count}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </AdminLayout>
  );
}