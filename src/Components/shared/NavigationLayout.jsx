import * as React from "react";
import {
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import useAuth from "../../hooks/useAuth";
import {
  ROLES,
  CLIENT_NAVLINKS,
  INTERNAL_NAVLINKS,
  AGENCY_NAVLINKS,
} from "../Constants/constants";
import { NavItemIcon } from "./NavItemIcon";
import { SmsTracking } from "iconsax-react";
import UserAvatar from "./UserAvatar";

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(
    ["width", "margin"],
    {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }
  ),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(
          ["width", "margin"],
          {
            easing: theme.transitions.easing.sharp,
            duration:
              theme.transitions.duration.enteringScreen,
          }
        ),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

function NavigationLayout() {
  const { auth } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const location = useLocation();

  const navItems = ROLES.CLIENT.includes(auth?.role)
    ? CLIENT_NAVLINKS
    : ROLES.INTERNAL.includes(auth?.role)
    ? INTERNAL_NAVLINKS
    : ROLES.AGENCY.includes(auth?.role)
    ? AGENCY_NAVLINKS
    : [];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className=" bg-[#056DDC]">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="w-full"
          >
            <div className="p-2 h-[60px] bg-[#056DDC] flex items-center justify-between">
              <div className=" logo-brandName ">
                <h1 className="text-white text-lg">
                  {" "}
                  <span className="font-bold">HD</span>{" "}
                  INTERVIEW PLATFORM
                </h1>
              </div>
              <div className="horizontal-navigation px-5 gap-x-2 flex items-center justify-center">
                <a
                  href="mailto:contact@hiringdog.com"
                  className="message p-2 bg-[#F5F7FA] rounded-full"
                >
                  <SmsTracking
                    size={24}
                    color="#F00000"
                    variant="Bold"
                  />
                </a>
                <UserAvatar />
              </div>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <div className="flex items-center justify-around w-full">
            <div>
              <h1 className="text-lg text-[#056DDC]">
                Hi
                {auth?.name ? `, ${auth?.name}` : ", User"}
              </h1>
            </div>
            <div>
              <IconButton
                onClick={handleDrawerClose}
                size="small"
              >
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
          </div>
        </DrawerHeader>
        <Divider />
        <List sx={{ border: "none" }}>
          {navItems.map((items) => (
            <ListItem
              key={items.text}
              disablePadding
              sx={{ display: "block" }}
              className={`${
                location.pathname.startsWith(items.link)
                  ? "bg-blue-100 rounded-corner"
                  : ""
              } `}
            >
              <ListItemButton
                sx={[
                  { minHeight: 44, pl: 3, pr: 1 },
                  open
                    ? { justifyContent: "initial" }
                    : { justifyContent: "center" },
                ]}
                onClick={() => navigate(items.link)}
                className="cursor-pointer"
              >
                <NavItemIcon
                  icon={items.icon}
                  isActive={location.pathname.startsWith(
                    items.link
                  )}
                />
                <ListItemText
                  primary={items.text}
                  className={`ml-3 text-sm ${
                    location.pathname.startsWith(items.link)
                      ? "text-[#056DDC] font-semibold "
                      : ""
                  } ${open ? "block" : "hidden"}`}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight:
                        location.pathname.startsWith(
                          items.link
                        )
                          ? 600
                          : "normal",
                      fontSize: "14px",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

export default NavigationLayout;
