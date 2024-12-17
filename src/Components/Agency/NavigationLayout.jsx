import * as React from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const DashboardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15.5 18.5C16.6 18.5 17.5 17.6 17.5 16.5V7.5C17.5 6.4 16.6 5.5 15.5 5.5C14.4 5.5 13.5 6.4 13.5 7.5V16.5C13.5 17.6 14.39 18.5 15.5 18.5Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.5 18.5C9.6 18.5 10.5 17.6 10.5 16.5V13C10.5 11.9 9.6 11 8.5 11C7.4 11 6.5 11.9 6.5 13V16.5C6.5 17.6 7.39 18.5 8.5 18.5Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

);
const ActiveDashboardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM9.91 16.19C9.91 16.83 9.39 17.35 8.74 17.35C8.1 17.35 7.58 16.83 7.58 16.19V12.93C7.58 12.29 8.1 11.77 8.74 11.77C9.39 11.77 9.91 12.29 9.91 12.93V16.19ZM16.42 16.19C16.42 16.83 15.9 17.35 15.26 17.35C14.61 17.35 14.09 16.83 14.09 16.19V7.81C14.09 7.17 14.61 6.65 15.26 6.65C15.9 6.65 16.42 7.17 16.42 7.81V16.19Z" fill="#056DDC" />
    </svg>
);

const CandidatesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14 8H19" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 12H19" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17 16H19" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.50043 11.2899C9.50007 11.2899 10.3104 10.4796 10.3104 9.47992C10.3104 8.48029 9.50007 7.66992 8.50043 7.66992C7.50079 7.66992 6.69043 8.48029 6.69043 9.47992C6.69043 10.4796 7.50079 11.2899 8.50043 11.2899Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 16.3298C11.86 14.8798 10.71 13.7398 9.26 13.6098C8.76 13.5598 8.25 13.5598 7.74 13.6098C6.29 13.7498 5.14 14.8798 5 16.3298" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
)
const ActiveCandidatesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 3H6C3.79 3 2 4.78 2 6.97V17.03C2 19.22 3.79 21 6 21H18C20.21 21 22 19.22 22 17.03V6.97C22 4.78 20.21 3 18 3ZM8.5 7.17C9.77 7.17 10.81 8.21 10.81 9.48C10.81 10.75 9.77 11.79 8.5 11.79C7.23 11.79 6.19 10.75 6.19 9.48C6.19 8.21 7.23 7.17 8.5 7.17ZM12.37 16.66C12.28 16.76 12.14 16.82 12 16.82H5C4.86 16.82 4.72 16.76 4.63 16.66C4.54 16.56 4.49 16.42 4.5 16.28C4.67 14.6 6.01 13.27 7.69 13.11C8.22 13.06 8.77 13.06 9.3 13.11C10.98 13.27 12.33 14.6 12.49 16.28C12.51 16.42 12.46 16.56 12.37 16.66ZM19 16.75H17C16.59 16.75 16.25 16.41 16.25 16C16.25 15.59 16.59 15.25 17 15.25H19C19.41 15.25 19.75 15.59 19.75 16C19.75 16.41 19.41 16.75 19 16.75ZM19 12.75H15C14.59 12.75 14.25 12.41 14.25 12C14.25 11.59 14.59 11.25 15 11.25H19C19.41 11.25 19.75 11.59 19.75 12C19.75 12.41 19.41 12.75 19 12.75ZM19 8.75H14C13.59 8.75 13.25 8.41 13.25 8C13.25 7.59 13.59 7.25 14 7.25H19C19.41 7.25 19.75 7.59 19.75 8C19.75 8.41 19.41 8.75 19 8.75Z" fill="#056DDC" />
    </svg>

)

function NavigationLayout() {
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
    const isMessageRouteActive = location.pathname === "/hiring-dog/client/message";

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, icon2: <ActiveDashboardIcon />, link: '/agency/dashboard' },
        { text: 'Candidates', icon: <CandidatesIcon />, icon2: <ActiveCandidatesIcon/>, link: '/agency/candidates'},
    ];



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar
                    className=' bg-[#056DDC]'
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
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div"
                        className='w-full'
                    >
                        <div className='p-2 h-[60px] bg-[#056DDC] flex items-center justify-between'>
                            <div className=' logo-brandName '>
                                <h1 className='text-white text-[24px]'> <span className='font-bold'>HD</span> INTERVIEW PLATFORM</h1>
                            </div>
                            <div className='horizontal-navigation px-5 gap-x-2 flex items-center justify-center'>
                                <Link
                                    to="/internal/message"
                                    className="message p-2 bg-[#F5F7FA] rounded-full"
                                >
                                    {isMessageRouteActive ? (
                                        // SVG icon to display when the route is active
                                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#EA3323"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" /></svg>
                                    ) : (
                                        // Default SVG ico
                                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#F00000"><path d="M146.67-160q-27 0-46.84-19.83Q80-199.67 80-226.67v-506.66q0-27 19.83-46.84Q119.67-800 146.67-800h424q-3.34 16.67-4 33.33-.67 16.67 2 33.34H150l330 212L629.33-617q11.34 10.33 24.17 18.62 12.83 8.28 26.83 14.38L480-454.67 146.67-670v443.33h666.66v-348q18.87-4.85 35.27-13.59Q865-597 880-608.67v382q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm0-573.33v506.66-506.66Zm613.25 86.66q-47.25 0-80.25-33.08-33-33.07-33-80.33 0-47.25 33.08-80.25 33.07-33 80.33-33 47.25 0 80.25 33.08 33 33.07 33 80.33 0 47.25-33.08 80.25-33.07 33-80.33 33Z" /></svg>
                                    )}
                                </Link>
                                <Link
                                    to="#"
                                    className="loggedInUser"
                                >
                                    <img
                                        className='p-2 h-16 rounded-full overflow-hidden'
                                        src="https://t4.ftcdn.net/jpg/05/86/94/95/360_F_586949566_ZRFuSSy8GSY6npXqnrJWhEdjqmlGURf2.jpg" alt="LoggedIn User" />

                                </Link>

                            </div>

                        </div>

                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
          
            >
                <DrawerHeader>
                    <div
                        className='flex items-center justify-around h-full w-full'
                    >
                        <div>
                            <h1 className='text-2xl text-[#056DDC]'>Hi, John</h1>
                        </div>
                        <div>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                    </div>


                </DrawerHeader>
                <Divider />
                <List
                    sx={{ border: 'none' }}
                >
                    {navItems.map((items) => (
                        <ListItem key={items.text} disablePadding sx={{ display: 'block' }}
                            className={`${location.pathname.startsWith(items.link) ? "bg-blue-100" : ""} `}
                        >
                            <ListItemButton
                                sx={[
                                    { minHeight: 48, px: 2.5 },
                                    open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                                ]}

                                onClick={() => navigate(items.link)}
                            >
                                <ListItemIcon
                                    sx={[
                                        { minWidth: 0, justifyContent: 'center' },
                                        open ? { mr: 3 } : { mr: 'auto' },
                                    ]}
                                    className=''
                                >
                                    {location.pathname.startsWith(items.link) ? items.icon2 : items.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={items.text}
                                    className={`${location.pathname.startsWith(items.link) ? "text-[#056DDC]" : ""} ${open ? "opacity-100" : "opacity-0"}`}
                                    sx={{
                                        "& .MuiTypography-root": {
                                          fontWeight: location.pathname.startsWith(items.link) ? 600 : 'normal', // Font weight for active route
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

export { NavigationLayout as AgencyNavigationLayout }
