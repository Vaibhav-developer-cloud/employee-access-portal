import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AdminLayout from "../../layouts/AdminLayout";
import { getStatusCount, getAccessTypes } from "../../services/analyticsApi";

const COLORS = ["#4caf50", "#ff9800", "#f44336"];
const STATUS_COLORS_MAP = {
  APPROVED: "#4caf50",
  PENDING: "#ff9800",
  REJECTED: "#f44336",
};

export default function Analytics() {
  const [statusData, setStatusData] = useState(null);
  const [accessTypeData, setAccessTypeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const statusRes = await getStatusCount();
      const accessRes = await getAccessTypes();

      // Format status data for chart
      const formattedStatusData = [
        { name: "Pending", value: statusRes.pending || 0, fill: "#ff9800" },
        { name: "Approved", value: statusRes.approved || 0, fill: "#4caf50" },
        { name: "Rejected", value: statusRes.rejected || 0, fill: "#f44336" },
      ];

      // Format access type data for chart
      const formattedAccessData = Array.isArray(accessRes)
        ? accessRes.map((item) => ({
            name: item.accessType || "Unknown",
            value: item.count || 0,
          }))
        : [];

      setStatusData(formattedStatusData);
      setAccessTypeData(formattedAccessData);
    } catch (err) {
      setError("Failed to fetch analytics. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalRequests = () => {
    if (!statusData) return 0;
    return statusData.reduce((sum, item) => sum + item.value, 0);
  };

  const getApprovedPercentage = () => {
    const total = getTotalRequests();
    if (total === 0) return 0;
    const approved = statusData.find((item) => item.name === "Approved")?.value || 0;
    return Math.round((approved / total) * 100);
  };

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
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Analytics Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", backgroundColor: "#e8f5e9" }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Total Requests
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#4caf50" }}>
                {getTotalRequests()}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", backgroundColor: "#fff3e0" }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Pending
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#ff9800" }}>
                {statusData.find((item) => item.name === "Pending")?.value || 0}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", backgroundColor: "#e8f5e9" }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Approved
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#4caf50" }}>
                {statusData.find((item) => item.name === "Approved")?.value || 0}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", backgroundColor: "#ffebee" }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Rejected
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#f44336" }}>
                {statusData.find((item) => item.name === "Rejected")?.value || 0}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Status Distribution Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Request Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Access Type Distribution Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Request Type Distribution
              </Typography>
              {accessTypeData && accessTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={accessTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accessTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="textSecondary">No data available</Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Table */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Status Breakdown
              </Typography>
              <Stack spacing={2}>
                {statusData.map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      backgroundColor: "#f5f7fb",
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: item.fill,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                    </Stack>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {item.value}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getTotalRequests() > 0
                          ? Math.round((item.value / getTotalRequests()) * 100)
                          : 0}
                        %
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Access Type Summary
              </Typography>
              {accessTypeData && accessTypeData.length > 0 ? (
                <Stack spacing={2}>
                  {accessTypeData.map((item, index) => (
                    <Box
                      key={item.name}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1.5,
                        backgroundColor: "#f5f7fb",
                        borderRadius: 1,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      </Stack>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="textSecondary">No data available</Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
