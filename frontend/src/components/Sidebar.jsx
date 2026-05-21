import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Stack,
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems =
    role === "ADMIN"
      ? [
          { label: "Dashboard", path: "/admin/dashboard", icon: DashboardIcon },
          { label: "All Requests", path: "/admin/requests", icon: AssignmentIcon },
          { label: "Analytics", path: "/admin/analytics", icon: AnalyticsIcon },
        ]
      : [
          { label: "Dashboard", path: "/employee/dashboard", icon: DashboardIcon },
          { label: "My Requests", path: "/employee/requests", icon: AssignmentIcon },
          { label: "Create Request", path: "/employee/create", icon: AddCircleIcon },
        ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          backgroundColor: "#fafafa",
        },
      }}
    >
      <Toolbar sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "white",
            width: "100%",
            textAlign: "center",
          }}
        >
          {role === "ADMIN" ? "Admin Panel" : "Employee Portal"}
        </Typography>
      </Toolbar>

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
          Logged in as
        </Typography>
        {/* <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
          {userId}
        </Typography> */}
        <Typography
          variant="caption"
          sx={{
            display: "inline-block",
            mt: 1,
            backgroundColor: "#e3f2fd",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 600,
            color: "#1976d2",
          }}
        >
          {/* {role} */}
          {userId}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 1,
                backgroundColor: isActive(item.path) ? "#e3f2fd" : "transparent",
                color: isActive(item.path) ? "#1976d2" : "textPrimary",
                fontWeight: isActive(item.path) ? 700 : 500,
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <Icon sx={{ mr: 2, fontSize: 20 }} />
              <ListItemText primary={item.label} sx={{ m: 0 }} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}