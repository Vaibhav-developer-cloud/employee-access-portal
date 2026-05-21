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

import AdminLayout from "../../layouts/AdminLayout";
import { getRequests, updateRequest } from "../../services/requestApi";
import RequestDetailModal from "../../components/RequestDetailModal";
import { STATUS_COLORS, STATUS_LABELS } from "../../constants";
import { formatDate } from "../../formatters";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [total, setTotal] = useState(0);

  // ---------------- FETCH DATA ----------------
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
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  // initial load + pagination sync
  useEffect(() => {
    fetchRequests(page, search, statusFilter);
  }, [page, rowsPerPage]);

  // ---------------- SEARCH ----------------
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(0);
    fetchRequests(0, value, statusFilter);
  };

  // ---------------- STATUS FILTER ----------------
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(0);
    fetchRequests(0, search, value);
  };

  // ---------------- PAGINATION ----------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ---------------- MODAL ----------------
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedRequest(null);
  };

  // ---------------- ACTIONS ----------------
  const handleApprove = async (remarks) => {
    try {
      const response = await updateRequest(selectedRequest.id, {
        status: "APPROVED",
        admin_remark: remarks,
      });

      if (response?.success) {
        setSuccess("Request approved successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchRequests(page, search, statusFilter);
      } else {
        setError(response?.message || "Failed to approve request");
      }
    } catch (err) {
      setError("Error approving request");
    }
  };

  const handleReject = async (remarks) => {
    try {
      const response = await updateRequest(selectedRequest.id, {
        status: "REJECTED",
        admin_remark: remarks,
      });

      if (response?.success) {
        setSuccess("Request rejected successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchRequests(page, search, statusFilter);
      } else {
        setError(response?.message || "Failed to reject request");
      }
    } catch (err) {
      setError("Error rejecting request");
    }
  };

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          All Access Requests
        </Typography>

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

        {/* FILTERS */}
        <Card sx={{ p: 2, mb: 2, backgroundColor: "#f5f7fb" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Employee, Title, or Type..."
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

        {/* TABLE */}
        <Card sx={{ boxShadow: "0 2px 8px rgba(28, 26, 26, 0.08)" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : requests.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>No requests found</Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f7fb" }}>
                    <TableCell>No</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {requests.map((request, index) => (
                    <TableRow key={request.id}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell>{request.employee_name}</TableCell>
                      <TableCell>{request.request_title}</TableCell>

                      <TableCell>
                        <Chip label={request.access_type} size="small" />
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

                      <TableCell>
                        {formatDate(request.created_at)}
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleViewDetails(request)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* PAGINATION */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
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

      {/* MODAL */}
      <RequestDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        requestId={selectedRequest?.id}
        request={selectedRequest}
        isAdmin={true}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </AdminLayout>
  );
}