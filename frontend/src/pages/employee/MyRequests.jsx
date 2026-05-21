import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  TextField,
  MenuItem,
  Chip,
  TablePagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { getRequests } from "../../services/requestApi";
import RequestDetailModal from "../../components/RequestDetailModal";
import { STATUS_COLORS, STATUS_LABELS } from "../../constants";
import { formatDate } from "../../formatters";

export default function EmployeeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const fetchRequests = async (
    pageNum = page,
    searchVal = search,
    statusVal = statusFilter
  ) => {
    setLoading(true);
    setError("");

    try {
      const res = await getRequests({
        page: pageNum + 1,
        limit: rowsPerPage,
        search: searchVal || undefined,
        status: statusVal || undefined,
      });

      const data = res?.data;
      setRequests(data.requests || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Failed to fetch requests. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page, search, statusFilter);
  }, [page, rowsPerPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(0);
    fetchRequests(0, value, statusFilter);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(0);
    fetchRequests(0, search, value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <EmployeeLayout>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            My Access Requests
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/employee/create")}
          >
            + New Request
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ p: 2, mb: 2, backgroundColor: "#f5f7fb" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Title, or Type..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <TextField
              select
              size="small"
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Stack>
        </Card>

        {/* Requests Table */}
        <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : requests.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="textSecondary">No requests found</Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f7fb" }}>
                    <TableCell sx={{ fontWeight: 700 }}>No</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Access Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request, index) => (
                    <TableRow key={request.id}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell>{request.request_title}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.access_type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={STATUS_LABELS[request.status]}
                          size="small"
                          sx={{
                            backgroundColor: STATUS_COLORS[request.status],
                            color: "white",
                          }}
                        />
                      </TableCell>

                      <TableCell>{formatDate(request.created_at)}</TableCell>

                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewDetails(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>
      </Box>

      {/* Request Detail Modal */}
      <RequestDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        requestId={selectedRequest?.id}
        request={selectedRequest}
        isAdmin={false}
      />
    </EmployeeLayout>
  );
}
