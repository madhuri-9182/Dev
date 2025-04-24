import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";

// Simple DrawerHeader for spacing
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function UnprotectedLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar
          className="bg-[#056DDC]"
          sx={{
            height: "50px",
            minHeight: "50px !important",
            "@media (min-width: 600px)": {
              minHeight: "50px !important",
            },
          }}
        >
          <Typography
            noWrap
            component="div"
            className="w-full"
          >
            <div className="p-2 h-[50px] bg-[#056DDC] flex items-center justify-between">
              <div className="logo-brandName">
                <h1 className="text-white text-md">
                  <span className="font-bold">HD</span>{" "}
                  INTERVIEW PLATFORM
                </h1>
              </div>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader
          sx={{
            height: "50px",
            minHeight: "50px !important",
          }}
        />
        <Outlet />
      </Box>
    </Box>
  );
}

export default UnprotectedLayout;
