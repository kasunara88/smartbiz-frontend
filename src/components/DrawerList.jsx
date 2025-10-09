import {
  Dashboard,
  People,
  Inventory,
  Receipt,
  Assessment,
  Settings,
  Logout,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const navItems = [
  { text: "Dashboard", icon: <Dashboard /> },
  { text: "Customers", icon: <People /> },
  { text: "Products", icon: <Inventory /> },
  { text: "Sales", icon: <Receipt /> },
  { text: "Reports", icon: <Assessment /> },
];

const secondaryNavItems = [
  { text: "Settings", icon: <Settings /> },
  { text: "Logout", icon: <Logout /> },
];

function DrawerList({ onNavigate }) {
  return (
    <Box
      sx={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => onNavigate(item.text)}
              sx={{
                "&:hover": { backgroundColor: "#334155" },
                "& .MuiListItemIcon-root": { color: "#94a3b8" },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box>
        <Divider sx={{ bgcolor: "#334155" }} />
        <List>
          {secondaryNavItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => onNavigate(item.text)}
                sx={{
                  "&:hover": { backgroundColor: "#334155" },
                  "& .MuiListItemIcon-root": {
                    color: item.text === "Logout" ? "#f87171" : "#94a3b8",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default DrawerList;
