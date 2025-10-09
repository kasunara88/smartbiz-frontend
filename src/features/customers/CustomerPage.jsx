import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomerFormModal from "../../components/CustomerFormModal";

function CustomerPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteComfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllCustomers();
      setCustomers(response || []);
    } catch (error) {
      setError("Failed to fetch customers", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
          (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
      ),
    [customers, search]
  );

  const openEditModal = (customer) => {
    setEditCustomer(customer);
    setModelOpen(true);
  };

  const openAddModal = () => {
    setEditCustomer(null);
    setModelOpen(true);
  };

  const handleAddCustomer = async (customerData) => {
    try {
      await api.addCustomer(customerData);
      setModelOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  const handleUpdateCustomer = async (customerData) => {
    try {
      await api.updateCustomer(editCustomer.id, customerData);
      setEditCustomer(null);
      setModelOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  const handleDeleteRequest = async (customer) => {
    setCustomerToDelete(customer);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      try {
        await api.deleteCustomer(customerToDelete.id);
        fetchCustomers();
      } catch (error) {
        console.error("Failed to delete customer:", error);
      }
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customers Managment
      </Typography>
      <Paper sx={{ mb: 2 }}>
        <Toolbar>
          <TextField
            label="Search customers"
            value={search}
            onChange={handleSearch}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              mb: 2,
              float: "right",
              p: 2,
              mt: 2,
            }}
            onClick={openAddModal}
          >
            Add Customer
          </Button>
        </Toolbar>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => openEditModal(customer)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteRequest(customer)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <CustomerFormModal
          open={modelOpen}
          onClose={() => setModelOpen(false)}
          onSave={editCustomer ? handleUpdateCustomer : handleAddCustomer}
          customer={editCustomer}
        />
      </Paper>
      <Dialog
        open={deleteComfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the customer "
            {customerToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerPage;
