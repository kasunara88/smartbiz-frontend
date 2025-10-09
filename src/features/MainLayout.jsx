import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  Drawer,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import DrawerList from "../components/DrawerList";

const drawerWidth = 240;
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function MainLayout({ children }) {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onNavigate = (path) => {
    if (path === "Logout") {
      navigate("/login");
    } else {
      navigate(`/${path.toLowerCase()}`);
    }
  };

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
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="h6" noWrap component="div">
              SmartBiz
            </Typography>
            <Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
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
      >
        <Toolbar />
        <DrawerList onNavigate={onNavigate} />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#0f172a", p: 3, minHeight: "100vh" }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;
