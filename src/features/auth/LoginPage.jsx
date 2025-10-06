import React, { useState } from "react";
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
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { motion } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RegisterPage from "./RegisterPage";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../api/api";

// --- Style Constants ---
const colorGrey300 = grey[400];
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

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await api.login(formData.email, formData.password);
        console.log(result);
        if (result.success) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("API Error", error);
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- Social Login Handlers ---
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
          <Container component="main" maxWidth="xl">
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
              }}
            >
              <Box sx={{ textAlign: "center", marginBottom: 3 }}>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Sign in to SmartBiz
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: colorGrey300, marginTop: 1 }}
                >
                  Start your journey with us
                </Typography>
              </Box>

              <FormControl
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <TextField
                  sx={textFieldStyles}
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
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
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={formData.password}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-checked": { color: "white" },
                        }}
                      />
                    }
                    label="Remember me"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  />
                  <Link
                    href="#"
                    underline="hover"
                    sx={{ color: "#60A5FA", "&:hover": { color: "#93C5FD" } }}
                  >
                    Forgot password?
                  </Link>
                </Box>

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
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <Grid
                  container
                  justifyContent="center"
                  sx={{ mt: 3, gap: 1, color: "rgba(255,255,255,0.5)" }}
                >
                  Don't have an account?{" "}
                  <Link
                    component={RouterLink}
                    underline="hover"
                    sx={{ color: "#60A5FA", "&:hover": { color: "#93C5FD" } }}
                    to="/register"
                  >
                    Sign Up
                  </Link>
                </Grid>

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
                    Or continue with
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

export default LoginPage;
