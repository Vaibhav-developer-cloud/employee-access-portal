import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 3, bgcolor: "#f5f7fb", minHeight: "100vh" }}>
        {children}
      </Box>
    </Box>
  );
}