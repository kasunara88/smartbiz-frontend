import React, { useMemo, useState } from "react";
import "./LoginPage.css";
import {
  Box,
  Typography,
  TextField,
  Container,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  IconButton,
  Link,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { motion } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// --- Style Constants ---
const colorGrey400 = grey[400];
const blue1 = "#1a4571";
const blue2 = "#051b2c";

// Styles for the TextFields
const textFieldStyles = {
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.4)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  // Styles for validation errors
  "& .MuiFormHelperText-root": {
    color: "#ff8a80",
  },
};

const MotionBox = motion.create(Box);

const socialIcons = [
  {
    provider: "google",
    icon: <GoogleIcon />,
    "aria-label": "Sign in with Google",
  },
  {
    provider: "github",
    icon: <GitHubIcon />,
    "aria-label": "Sign in with GitHub",
  },
  {
    provider: "linkedin",
    icon: <LinkedInIcon />,
    "aria-label": "Sign in with LinkedIn",
  },
];

const PasswordStrength = ({ password }) => {
  const requirments = useMemo(
    () => [
      { text: "At least 8 characters", met: password.length >= 8 },
      { text: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
      { text: "Contains a number", met: /[0-9]/.test(password) },
      {
        text: "Contains a special character (!@#$%)",
        met: /[!@#$%^&*]/.test(password),
      },
    ],
    [password]
  );
  if (!password) return null;

  return (
    <List dense sx={{ p: 0, mt: 1 }}>
      {requirments.map((req) => (
        <ListItem key={req.text} disableGutters sx={{ py: 0 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            {req.met ? (
              <CheckCircleIcon fontSize="small" color="success" />
            ) : (
              <CancelIcon fontSize="small" color="error" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={req.text}
            primaryTypographyProps={{
              variant: "caption",
              color: req.met ? "success.main" : "error.main",
            }}
          ></ListItemText>
        </ListItem>
      ))}{" "}
    </List>
  );
};

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    termAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/v1/smartbiz/auth/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
        console.log("Registration sucessfull", data);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  //   --- Social Login Handlers ---
  const handleSocialLogin = (provider) => {
    let url = "";
    switch (provider) {
      case "google":
        url = "https://accounts.google.com/";
        break;
      case "github":
        url = "https://github.com/login";
        break;
      case "linkedin":
        url = "https://www.linkedin.com/login";
        break;
      default:
        return;
    }
    window.location.href = url;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundImage: `linear-gradient(to bottom right, ${blue1}, ${blue2})`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
          }}
        >
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </Box>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          sx={{
            maxWidth: "28rem",
            width: "100%",
            position: "relative",
            zIndex: 10,
            p: 2,
          }}
        >
          <Container component="main" sx={{ Width: "120%" }}>
            <Box
              sx={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: { xs: 3, md: 4 },
                borderRadius: "1.5rem",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                width: "100%",
              }}
            >
              <Box sx={{ textAlign: "center", marginBottom: 3 }}>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Create Your Account
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: colorGrey400,
                    marginTop: 1,
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  Already have an account?
                  <Link
                    href="#"
                    underline="hover"
                    sx={{
                      color: "#60A5FA",
                      "&:hover": { color: "#93C5FD" },
                      fontWeight: "bold",
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>

              <FormControl
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ width: "100%" }}
              >
                <Grid container spacing={2}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    margin="normal"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    sx={textFieldStyles}
                    fullWidth
                  />
                </Grid>
                <Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      margin="normal"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      sx={textFieldStyles}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <TextField
                  margin="normal"
                  sx={textFieldStyles}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleInputChange}
                  value={formData.email}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  sx={textFieldStyles}
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <PasswordStrength password={formData.password} />
                <TextField
                  sx={textFieldStyles}
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  onChange={handleInputChange}
                  value={formData.confirmPassword}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {apiError && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      width: "100%",
                      backgroundColor: "rgba(255, 82, 82, 0.1)",
                      color: "#ffcdd2",
                    }}
                  >
                    {apiError}
                  </Alert>
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="termsAccepted"
                      checked={!!formData.termsAccepted}
                      onChange={handleInputChange}
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&.Mui-checked": { color: "white" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: errors.termsAccepted
                          ? "error.main"
                          : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      I accept the{" "}
                      <Link
                        href="#"
                        underline="always"
                        sx={{ color: "#60A5FA" }}
                      >
                        Terms and Conditions
                      </Link>
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    backgroundColor: "#2563EB",
                    borderRadius: "0.5rem",
                    fontWeight: "600",
                    "&:hover": { backgroundColor: "#3B82F6" },
                    "&:disabled": {
                      backgroundColor: "#1e40af",
                      color: "rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: "inherit" }} />
                  ) : (
                    "Creare Account"
                  )}
                </Button>

                <Divider
                  sx={{
                    my: 3,
                    "&::before, &::after": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    Or register with
                  </Typography>
                </Divider>

                <Grid container spacing={2} justifyContent="center">
                  {socialIcons.map((item) => (
                    <Grid key={item.provider}>
                      <IconButton
                        onClick={() => handleSocialLogin(item.provider)}
                        aria-label={item["aria-label"]}
                        sx={{
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: 2,
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        {item.icon}
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </FormControl>
            </Box>
          </Container>
        </MotionBox>
      </Box>
    </>
  );
}

export default RegisterPage;
