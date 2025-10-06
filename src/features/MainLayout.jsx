import { useState } from "react";
// import MenuIcon from "@mui/icons-material/Menu";
import DashboardPage from "./dashboard/DashboardPage";
import {
  Box,
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  Drawer,
  Container,
} from "@mui/material";

const drawerWidth = 240;
const settings = ["Profile", "Account", "Dashboard", "Logout"];
const navItems = [
  { text: "Dashboard", icon: <DashboardPage /> },
  // { text: "Customers", icon: <People /> },
  // { text: "Products", icon: <Inventory /> },
  // { text: "Sales", icon: <Receipt /> },
  // { text: "Reports", icon: <Assessment /> },
  // { text: "Settings", icon: <Settings /> },
];

function MainLayout() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#1e293b",
          boxShadow: "none",
          borderBottom: "1px solid #334155",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="div">
              SmartBiz
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1e293b",
            borderRight: "1px solid #334155",
            color: "white",
          },
        }}
        variant="permanent"
        anchor="left"
      ></Drawer>
    </Box>
  );
}

export default MainLayout;
