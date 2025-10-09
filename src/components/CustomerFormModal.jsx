import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

function CustomerFormModal({ open, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    } else {
      setFormData({ name: "", email: "", phone: "" });
    }
  }, [customer, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {customer ? "Edit Customer" : "Add New Customer"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Full Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          error={!!formError.name}
          helperText={formError.name}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          error={!!formError.email}
          helperText={formError.email}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone Number"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.phone}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {customer ? "Save Changes" : "Add Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerFormModal;
