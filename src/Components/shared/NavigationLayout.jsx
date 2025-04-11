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
  INTERVIEWER_NAVLINKS,
} from "../Constants/constants";
import { NavItemIcon } from "./NavItemIcon";
import { SmsTracking } from "iconsax-react";
import UserAvatar from "./UserAvatar";
import TermsAndConditionsModal from "./TnCModal";
import ChangePasswordModal from "./PasswordChangeModal";

const drawerWidth = 180;

// ...keep all other styling code unchanged...
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
        height: "50px",
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
  const { auth, setAuth } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [showTncModal, setShowTncModal] =
    React.useState(false);
  const [
    showChangePasswordModal,
    setShowChangePasswordModal,
  ] = React.useState(false);
  const navigate = useNavigate();

  // Check if user is an interviewer
  const isInterviewer = ROLES.INTERVIEWER.includes(
    auth?.role
  );
  const isInternal = ROLES.INTERNAL.includes(auth?.role);

  const fullName = auth?.name ? auth?.name : "User";
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const location = useLocation();

  React.useEffect(() => {
    if (!isInternal) {
      if (auth?.accessToken) {
        // Check for Terms and Conditions first
        if (auth?.is_policy_and_tnc_accepted === false) {
          setShowTncModal(true);
          setShowChangePasswordModal(false);
        }
        // If T&C accepted but password change required, show password modal
        else if (auth?.is_password_change === false) {
          setShowTncModal(false);
          setShowChangePasswordModal(true);
        } else {
          // Both conditions satisfied, hide both modals
          setShowTncModal(false);
          setShowChangePasswordModal(false);
        }
      }
    }
  }, [
    auth?.is_policy_and_tnc_accepted,
    auth?.is_password_change,
    auth?.accessToken,
    isInternal,
  ]);

  const handleTncAccept = (updatedAuth) => {
    setAuth(updatedAuth);
    setShowTncModal(false);

    // After T&C acceptance, check if password change is required
    if (updatedAuth?.is_password_change === false) {
      setShowChangePasswordModal(true);
    }
  };

  const handlePasswordChangeSuccess = () => {
    // Update auth context (already done in the modal)
    setShowChangePasswordModal(false);
  };

  const navItems = ROLES.CLIENT.includes(auth?.role)
    ? CLIENT_NAVLINKS
    : ROLES.INTERNAL.includes(auth?.role)
    ? INTERNAL_NAVLINKS
    : ROLES.AGENCY.includes(auth?.role)
    ? AGENCY_NAVLINKS
    : ROLES.INTERVIEWER.includes(auth?.role)
    ? INTERVIEWER_NAVLINKS
    : [];

  // When Calendar link is clicked for interviewer role
  const handleCalendarLinkClick = async () => {
    try {
      // Import necessary modules only when needed (dynamic import)
      const { getGoogleEvents } = await import(
        "../Interviewer/api"
      );
      const axios = (await import("../../api/axios"))
        .default;
      const toast = (await import("react-hot-toast"))
        .default;

      try {
        // Check if we can access Google Calendar events
        const eventsResponse = await getGoogleEvents();
        if (
          eventsResponse &&
          eventsResponse.status === "success"
        ) {
          navigate("/interviewer/calendar");
        } else {
          // If not, initiate Google auth flow
          const authResponse = await axios.get(
            "/api/google-auth/init/"
          );
          if (authResponse.data?.data?.url) {
            window.location.href =
              authResponse.data.data.url;
          }
        }
      } catch (error) {
        console.error("Error accessing calendar:", error);
        // If API call fails, try to initiate Google auth flow
        try {
          const authResponse = await axios.get(
            "/api/google-auth/init/"
          );
          if (authResponse.data?.data?.url) {
            window.location.href =
              authResponse.data.data.url;
          }
        } catch (authError) {
          console.error(
            "Error initializing Google Auth:",
            authError
          );
          toast.error(
            "Failed to connect to Google Calendar"
          );
        }
      }
    } catch (importError) {
      console.error(
        "Error importing modules:",
        importError
      );
      // Fallback to direct navigation if imports fail
      navigate("/interviewer/calendar");
    }
  };

  const handleNavItemClick = (item) => {
    // Special handling for Calendar link only when user is an interviewer
    if (isInterviewer && item.text === "Calendar") {
      handleCalendarLinkClick();
    } else {
      navigate(item.link);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          className=" bg-[#056DDC]"
          sx={{
            height: "50px",
            minHeight: "50px !important",
            "@media (min-width: 600px)": {
              minHeight: "50px !important",
            },
          }}
        >
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
            noWrap
            component="div"
            className="w-full"
          >
            <div className="p-2 h-[50px] bg-[#056DDC] flex items-center justify-between">
              <div className=" logo-brandName ">
                <h1 className="text-white text-md">
                  {" "}
                  <span className="font-bold">HD</span>{" "}
                  INTERVIEW PLATFORM
                </h1>
              </div>
              <div className="horizontal-navigation px-5 gap-x-2 flex items-center justify-center">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@hiringdog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-[6px] bg-[#F5F7FA] rounded-full"
                >
                  <SmsTracking
                    size={20}
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
        <DrawerHeader
          sx={{
            height: "50px",
            minHeight: "50px !important",
            "@media (min-width: 600px)": {
              minHeight: "50px !important",
            },
          }}
        >
          <div className="flex items-center justify-between gap-2 w-full">
            <div
              className="text-sm text-[#056DDC] font-medium ml-2 truncate"
              title={fullName}
            >
              Hi, {fullName}
            </div>

            <div>
              <IconButton
                sx={{
                  padding: "0",
                }}
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
        <List sx={{ border: "none", padding: 0 }}>
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
                  {
                    minHeight: 40,
                    height: 40,
                    pl: 2,
                  },
                  open
                    ? { justifyContent: "initial" }
                    : { justifyContent: "center" },
                ]}
                onClick={() => handleNavItemClick(items)}
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
                  className={`ml-2 ${
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
                      fontSize: "13px",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader
          sx={{
            height: "50px",
            minHeight: "50px !important",
          }}
        />
        <Outlet />
      </Box>

      {/* Terms and Conditions Modal */}
      {showTncModal && (
        <TermsAndConditionsModal
          auth={auth}
          onAccept={handleTncAccept}
        />
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
    </Box>
  );
}

export default NavigationLayout;
