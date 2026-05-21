import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        user_id: userId,
        password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", userId);

        if (data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      } else {
        setError(data?.detail || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: "white", fontSize: 32 }} />
            </Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Access Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Employee Access Portal
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="User ID"
              variant="outlined"
              size="medium"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              size="medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </Stack>

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
              py: 1.5,
              mb: 2,
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Demo Credentials */}
          {/* <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: "#f5f7fb",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1 }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" sx={{ display: "block", color: "textSecondary" }}>
              <strong>Employee:</strong> employee1 / password123
            </Typography>
            <Typography variant="caption" sx={{ display: "block", color: "textSecondary" }}>
              <strong>Admin:</strong> admin1 / password123
            </Typography>
          </Paper> */}
        </Card>
      </Container>
    </Box>
  );
}