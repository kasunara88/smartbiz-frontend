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
import SupplierFormModal from "../../components/SupplierFormModel";

function SupplierPage() {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [deleteComfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllSuppliers();
      setSuppliers(response || []);
    } catch (error) {
      setError("Failed to fetch suppliers", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
          (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
      ),
    [suppliers, search]
  );

  const openEditModal = (supplier) => {
    setEditSupplier(supplier);
    setModelOpen(true);
  };

  const openAddModal = () => {
    setEditSupplier(null);
    setModelOpen(true);
  };

  const handleAddSupplier = async (supplierData) => {
    try {
      await api.addSupplier(supplierData);
      setModelOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Failed to add supplier:", error);
    }
  };

  const handleUpdateSupplier = async (supplierData) => {
    try {
      await api.updateSupplier(editSupplier.id, supplierData);
      setEditSupplier(null);
      setModelOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Failed to update supplier:", error);
    }
  };

  const handleDeleteRequest = async (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (supplierToDelete) {
      try {
        await api.deleteSupplier(supplierToDelete.id);
        fetchSuppliers();
      } catch (error) {
        console.error("Failed to delete supplier:", error);
      }
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Supplier Managment
      </Typography>
      <Paper sx={{ mb: 2 }}>
        <Toolbar>
          <TextField
            label="Search suppliers"
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
            Add Supplier
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
                  <TableCell>Address</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.id}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.address}</TableCell>

                    <TableCell>
                      <IconButton onClick={() => openEditModal(supplier)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteRequest(supplier)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <SupplierFormModal
          open={modelOpen}
          onClose={() => setModelOpen(false)}
          onSave={editSupplier ? handleUpdateSupplier : handleAddSupplier}
          supplier={editSupplier}
        />
      </Paper>
      <Dialog
        open={deleteComfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the supplier "
            {supplierToDelete?.name}"? This action cannot be undone.
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

export default SupplierPage;
