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
    <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM9.91 16.19C9.91 16.83 9.39 17.35 8.74 17.35C8.1 17.35 7.58 16.83 7.58 16.19V12.93C7.58 12.29 8.1 11.77 8.74 11.77C9.39 11.77 9.91 12.29 9.91 12.93V16.19ZM16.42 16.19C16.42 16.83 15.9 17.35 15.26 17.35C14.61 17.35 14.09 16.83 14.09 16.19V7.81C14.09 7.17 14.61 6.65 15.26 6.65C15.9 6.65 16.42 7.17 16.42 7.81V16.19Z" fill="#056DDC"/>
    </svg>
);

const ClientIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.0802 8.58003V15.42C21.0802 16.54 20.4802 17.58 19.5102 18.15L13.5702 21.58C12.6002 22.14 11.4002 22.14 10.4202 21.58L4.48016 18.15C3.51016 17.59 2.91016 16.55 2.91016 15.42V8.58003C2.91016 7.46003 3.51016 6.41999 4.48016 5.84999L10.4202 2.42C11.3902 1.86 12.5902 1.86 13.5702 2.42L19.5102 5.84999C20.4802 6.41999 21.0802 7.45003 21.0802 8.58003Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.9999 10.9998C13.2867 10.9998 14.3299 9.95662 14.3299 8.6698C14.3299 7.38298 13.2867 6.33984 11.9999 6.33984C10.7131 6.33984 9.66992 7.38298 9.66992 8.6698C9.66992 9.95662 10.7131 10.9998 11.9999 10.9998Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16 16.6599C16 14.8599 14.21 13.3999 12 13.3999C9.79 13.3999 8 14.8599 8 16.6599" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
);
const ActiveClientIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5099 5.85L13.5699 2.42C12.5999 1.86 11.3999 1.86 10.4199 2.42L4.48992 5.85C3.51992 6.41 2.91992 7.45 2.91992 8.58V15.42C2.91992 16.54 3.51992 17.58 4.48992 18.15L10.4299 21.58C11.3999 22.14 12.5999 22.14 13.5799 21.58L19.5199 18.15C20.4899 17.59 21.0899 16.55 21.0899 15.42V8.58C21.0799 7.45 20.4799 6.42 19.5099 5.85ZM11.9999 7.34C13.2899 7.34 14.3299 8.38 14.3299 9.67C14.3299 10.96 13.2899 12 11.9999 12C10.7099 12 9.66992 10.96 9.66992 9.67C9.66992 8.39 10.7099 7.34 11.9999 7.34ZM14.6799 16.66H9.31992C8.50992 16.66 8.03992 15.76 8.48992 15.09C9.16992 14.08 10.4899 13.4 11.9999 13.4C13.5099 13.4 14.8299 14.08 15.5099 15.09C15.9599 15.75 15.4799 16.66 14.6799 16.66Z" fill="#056DDC"/>
    </svg>
    

);
const InterviewerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.1404 21.6198C17.2604 21.8798 16.2204 21.9998 15.0004 21.9998H9.00035C7.78035 21.9998 6.74035 21.8798 5.86035 21.6198C6.08035 19.0198 8.75035 16.9697 12.0004 16.9697C15.2504 16.9697 17.9204 19.0198 18.1404 21.6198Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 2H9C4 2 2 4 2 9V15C2 18.78 3.14 20.85 5.86 21.62C6.08 19.02 8.75 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62C20.86 20.85 22 18.78 22 15V9C22 4 20 2 15 2ZM12 14.17C10.02 14.17 8.42 12.56 8.42 10.58C8.42 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58C15.58 12.56 13.98 14.17 12 14.17Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15.5799 10.58C15.5799 12.56 13.9799 14.17 11.9999 14.17C10.0199 14.17 8.41992 12.56 8.41992 10.58C8.41992 8.60002 10.0199 7 11.9999 7C13.9799 7 15.5799 8.60002 15.5799 10.58Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


);
const ActiveInterviewerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 19 3.29 20.93 5.56 21.66C6.22 21.89 6.98 22 7.81 22H16.19C17.02 22 17.78 21.89 18.44 21.66C20.71 20.93 22 19 22 16.19V7.81C22 4.17 19.83 2 16.19 2ZM20.5 16.19C20.5 18.33 19.66 19.68 17.97 20.24C17 18.33 14.7 16.97 12 16.97C9.3 16.97 7.01 18.32 6.03 20.24H6.02C4.35 19.7 3.5 18.34 3.5 16.2V7.81C3.5 4.99 4.99 3.5 7.81 3.5H16.19C19.01 3.5 20.5 4.99 20.5 7.81V16.19Z" fill="#056DDC"/>
    <path d="M11.9999 8C10.0199 8 8.41992 9.6 8.41992 11.58C8.41992 13.56 10.0199 15.17 11.9999 15.17C13.9799 15.17 15.5799 13.56 15.5799 11.58C15.5799 9.6 13.9799 8 11.9999 8Z" fill="#056DDC"/>
    </svg>
    

);
const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16.9704 14.4402C18.3404 14.6702 19.8504 14.4302 20.9104 13.7202C22.3204 12.7802 22.3204 11.2402 20.9104 10.3002C19.8404 9.59016 18.3104 9.35016 16.9404 9.59016" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.97047 7.16C6.03047 7.15 6.10047 7.15 6.16047 7.16C7.54047 7.11 8.64047 5.98 8.64047 4.58C8.64047 3.15 7.49047 2 6.06047 2C4.63047 2 3.48047 3.16 3.48047 4.58C3.49047 5.98 4.59047 7.11 5.97047 7.16Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7.00043 14.4402C5.63043 14.6702 4.12043 14.4302 3.06043 13.7202C1.65043 12.7802 1.65043 11.2402 3.06043 10.3002C4.13043 9.59016 5.66043 9.35016 7.03043 9.59016" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.0001 14.6302C11.9401 14.6202 11.8701 14.6202 11.8101 14.6302C10.4301 14.5802 9.33008 13.4502 9.33008 12.0502C9.33008 10.6202 10.4801 9.47021 11.9101 9.47021C13.3401 9.47021 14.4901 10.6302 14.4901 12.0502C14.4801 13.4502 13.3801 14.5902 12.0001 14.6302Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.08973 17.7804C7.67973 18.7204 7.67973 20.2603 9.08973 21.2003C10.6897 22.2703 13.3097 22.2703 14.9097 21.2003C16.3197 20.2603 16.3197 18.7204 14.9097 17.7804C13.3197 16.7204 10.6897 16.7204 9.08973 17.7804Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


);
const ActiveUserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.53 7.77C17.46 7.76 17.39 7.76 17.32 7.77C15.77 7.72 14.54 6.45 14.54 4.89C14.54 3.3 15.83 2 17.43 2C19.02 2 20.32 3.29 20.32 4.89C20.31 6.45 19.08 7.72 17.53 7.77Z" fill="#056DDC"/>
    <path d="M20.79 14.6999C19.67 15.4499 18.1 15.7299 16.65 15.5399C17.03 14.7199 17.23 13.8099 17.24 12.8499C17.24 11.8499 17.02 10.8999 16.6 10.0699C18.08 9.86991 19.65 10.1499 20.78 10.8999C22.36 11.9399 22.36 13.6499 20.79 14.6999Z" fill="#056DDC"/>
    <path d="M6.43997 7.77C6.50997 7.76 6.57997 7.76 6.64997 7.77C8.19997 7.72 9.42997 6.45 9.42997 4.89C9.42997 3.29 8.13997 2 6.53997 2C4.94997 2 3.65997 3.29 3.65997 4.89C3.65997 6.45 4.88997 7.72 6.43997 7.77Z" fill="#056DDC"/>
    <path d="M6.55 12.8501C6.55 13.8201 6.75999 14.7401 7.14 15.5701C5.73 15.7201 4.26 15.4201 3.18 14.7101C1.6 13.6601 1.6 11.9501 3.18 10.9001C4.25 10.1801 5.75999 9.8901 7.18 10.0501C6.77 10.8901 6.55 11.8401 6.55 12.8501Z" fill="#056DDC"/>
    <path d="M12.12 15.87C12.04 15.86 11.95 15.86 11.86 15.87C10.02 15.81 8.54999 14.3 8.54999 12.44C8.55999 10.54 10.09 9 12 9C13.9 9 15.44 10.54 15.44 12.44C15.43 14.3 13.97 15.81 12.12 15.87Z" fill="#056DDC"/>
    <path d="M8.86999 17.9401C7.35999 18.9501 7.35999 20.6101 8.86999 21.6101C10.59 22.7601 13.41 22.7601 15.13 21.6101C16.64 20.6001 16.64 18.9401 15.13 17.9401C13.42 16.7901 10.6 16.7901 8.86999 17.9401Z" fill="#056DDC"/>
    </svg>
    

);
const AgreementsIcon = () => (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.5303 11.3V7.04001C20.5303 3.01001 19.5903 2 15.8103 2H8.25027C4.47027 2 3.53027 3.01001 3.53027 7.04001V18.3C3.53027 20.96 4.99028 21.59 6.76028 19.69L6.77026 19.68C7.59026 18.81 8.84026 18.88 9.55026 19.83L10.5603 21.18" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.03027 7H16.0303" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.03027 11H15.0303" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18.2413 14.7703L14.7013 18.3103C14.5613 18.4503 14.4313 18.7103 14.4013 18.9003L14.2113 20.2503C14.1413 20.7403 14.4813 21.0803 14.9713 21.0103L16.3213 20.8203C16.5113 20.7903 16.7813 20.6603 16.9113 20.5203L20.4513 16.9803C21.0613 16.3703 21.3513 15.6603 20.4513 14.7603C19.5613 13.8703 18.8513 14.1603 18.2413 14.7703Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17.7295 15.2803C18.0295 16.3603 18.8695 17.2003 19.9495 17.5003" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


);
const ActiveAgreementsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.96 4.96 21.59 6.73 19.69L6.74 19.68C7.56 18.81 8.81 18.88 9.52 19.83L10.53 21.18C11.34 22.25 12.65 22.25 13.46 21.18L14.47 19.83C15.19 18.87 16.44 18.8 17.26 19.68C19.04 21.58 20.49 20.95 20.49 18.29V7.04C20.5 3.01 19.56 2 15.78 2ZM14.84 9.99L14.34 10.5H14.33L11.3 13.53C11.17 13.66 10.9 13.8 10.71 13.82L9.36 14.02C8.87 14.09 8.53 13.74 8.6 13.26L8.79 11.9C8.82 11.71 8.95 11.45 9.08 11.31L12.12 8.28L12.62 7.77C12.95 7.44 13.32 7.2 13.72 7.2C14.06 7.2 14.43 7.36 14.84 7.77C15.74 8.67 15.45 9.38 14.84 9.99Z" fill="#056DDC"/>
    </svg>
    

);
const FinanceIcon = () => (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.04883 12.6099H19.0488" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19.0488 10.2798V17.4298C19.0188 20.2798 18.2388 20.9998 15.2688 20.9998H5.82886C2.80886 20.9998 2.04883 20.2498 2.04883 17.2698V10.2798C2.04883 7.5798 2.67883 6.70981 5.04883 6.56981C5.28883 6.55981 5.54886 6.5498 5.82886 6.5498H15.2688C18.2888 6.5498 19.0488 7.2998 19.0488 10.2798Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M22.0488 6.73V13.72C22.0488 16.42 21.4188 17.29 19.0488 17.43V10.28C19.0488 7.3 18.2888 6.55 15.2688 6.55H5.82886C5.54886 6.55 5.28883 6.56 5.04883 6.57C5.07883 3.72 5.85886 3 8.82886 3H18.2688C21.2888 3 22.0488 3.75 22.0488 6.73Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.29883 17.8101H7.0188" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.15918 17.8101H12.5992" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


);
const ActiveFinanceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.22 6.5498H5.78C5.5 6.5498 5.24 6.5598 5 6.5698C2.63 6.7098 2 7.5798 2 10.2798V10.8598C2 11.4098 2.45 11.8598 3 11.8598H18C18.55 11.8598 19 11.4098 19 10.8598V10.2798C19 7.2998 18.24 6.5498 15.22 6.5498Z" fill="#056DDC"/>
    <path d="M3 13.3599C2.45 13.3599 2 13.8099 2 14.3599V17.2699C2 20.2499 2.76 20.9999 5.78 20.9999H15.22C18.19 20.9999 18.97 20.2799 19 17.4299V14.3599C19 13.8099 18.55 13.3599 18 13.3599H3ZM6.96 18.5599H5.25C4.84 18.5599 4.5 18.2199 4.5 17.8099C4.5 17.3999 4.84 17.0599 5.25 17.0599H6.97C7.38 17.0599 7.72 17.3999 7.72 17.8099C7.72 18.2199 7.38 18.5599 6.96 18.5599ZM12.55 18.5599H9.11C8.7 18.5599 8.36 18.2199 8.36 17.8099C8.36 17.3999 8.7 17.0599 9.11 17.0599H12.55C12.96 17.0599 13.3 17.3999 13.3 17.8099C13.3 18.2199 12.97 18.5599 12.55 18.5599Z" fill="#056DDC"/>
    <path d="M22.0001 13.3301V8.0901C22.0001 4.9601 20.2101 3.6001 17.5101 3.6001H8.58011C7.82011 3.6001 7.14011 3.7101 6.54011 3.9401C6.07011 4.1101 5.65011 4.3601 5.31011 4.6901C5.13011 4.8601 5.27011 5.1401 5.53011 5.1401H16.4001C18.6501 5.1401 20.4701 6.9601 20.4701 9.2101V16.3801C20.4701 16.6301 20.7401 16.7701 20.9201 16.5901C21.6101 15.8601 22.0001 14.7901 22.0001 13.3301Z" fill="#056DDC"/>
    </svg>
    

);
const EngagementIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.96 6.16992C18.96 7.55992 20.34 9.76992 20.62 12.3199" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3.49023 12.3702C3.75023 9.83021 5.11023 7.62021 7.09023 6.22021" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.19043 20.9399C9.35043 21.5299 10.6704 21.8599 12.0604 21.8599C13.4004 21.8599 14.6604 21.5599 15.7904 21.0099" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.0603 7.70014C13.5956 7.70014 14.8403 6.45549 14.8403 4.92014C14.8403 3.38479 13.5956 2.14014 12.0603 2.14014C10.5249 2.14014 9.28027 3.38479 9.28027 4.92014C9.28027 6.45549 10.5249 7.70014 12.0603 7.70014Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.8298 19.9199C6.36516 19.9199 7.60981 18.6752 7.60981 17.1399C7.60981 15.6045 6.36516 14.3599 4.8298 14.3599C3.29445 14.3599 2.0498 15.6045 2.0498 17.1399C2.0498 18.6752 3.29445 19.9199 4.8298 19.9199Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19.1696 19.9199C20.705 19.9199 21.9496 18.6752 21.9496 17.1399C21.9496 15.6045 20.705 14.3599 19.1696 14.3599C17.6343 14.3599 16.3896 15.6045 16.3896 17.1399C16.3896 18.6752 17.6343 19.9199 19.1696 19.9199Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


);
const ActiveEngagementIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.3601 12.7301C19.9901 12.7301 19.6801 12.4501 19.6401 12.0801C19.4001 9.88007 18.2201 7.90007 16.4001 6.64007C16.0701 6.41007 15.9901 5.96007 16.2201 5.63007C16.4501 5.30007 16.9001 5.22007 17.2301 5.45007C19.4001 6.96007 20.8001 9.32007 21.0901 11.9301C21.1301 12.3301 20.8401 12.6901 20.4401 12.7301C20.4101 12.7301 20.3901 12.7301 20.3601 12.7301Z" fill="#056DDC"/>
    <path d="M3.74004 12.7802C3.72004 12.7802 3.69004 12.7802 3.67004 12.7802C3.27004 12.7402 2.98004 12.3802 3.02004 11.9802C3.29004 9.3702 4.67004 7.0102 6.82004 5.4902C7.14004 5.2602 7.60004 5.3402 7.83004 5.6602C8.06004 5.9902 7.98004 6.4402 7.66004 6.6702C5.86004 7.9502 4.69004 9.9302 4.47004 12.1202C4.43004 12.5002 4.11004 12.7802 3.74004 12.7802Z" fill="#056DDC"/>
    <path d="M15.9901 21.0998C14.7601 21.6898 13.4401 21.9898 12.0601 21.9898C10.6201 21.9898 9.2501 21.6698 7.9701 21.0198C7.6101 20.8498 7.4701 20.4098 7.6501 20.0498C7.8201 19.6898 8.2601 19.5498 8.6201 19.7198C9.2501 20.0398 9.9201 20.2598 10.6001 20.3898C11.5201 20.5698 12.4601 20.5798 13.3801 20.4198C14.0601 20.2998 14.7301 20.0898 15.3501 19.7898C15.7201 19.6198 16.1601 19.7598 16.3201 20.1298C16.5001 20.4898 16.3601 20.9298 15.9901 21.0998Z" fill="#056DDC"/>
    <path d="M12.05 2.00977C10.5 2.00977 9.22998 3.26977 9.22998 4.82977C9.22998 6.38977 10.49 7.64977 12.05 7.64977C13.61 7.64977 14.87 6.38977 14.87 4.82977C14.87 3.26977 13.61 2.00977 12.05 2.00977Z" fill="#056DDC"/>
    <path d="M5.04998 13.8701C3.49998 13.8701 2.22998 15.1301 2.22998 16.6901C2.22998 18.2501 3.48998 19.5101 5.04998 19.5101C6.60998 19.5101 7.86998 18.2501 7.86998 16.6901C7.86998 15.1301 6.59998 13.8701 5.04998 13.8701Z" fill="#056DDC"/>
    <path d="M18.9499 13.8701C17.3999 13.8701 16.1299 15.1301 16.1299 16.6901C16.1299 18.2501 17.3899 19.5101 18.9499 19.5101C20.5099 19.5101 21.7699 18.2501 21.7699 16.6901C21.7699 15.1301 20.5099 13.8701 18.9499 13.8701Z" fill="#056DDC"/>
    </svg>
    


);

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
        { text: 'Dashboard', icon: <DashboardIcon />,icon2:<ActiveDashboardIcon/>, link: '/internal/dashboard' },
        { text: 'Clients', icon: <ClientIcon />,icon2:<ActiveClientIcon/>, link: '/internal/clients' },
        { text: 'Interviewer', icon: <InterviewerIcon />,icon2:<ActiveInterviewerIcon/>, link: '/internal/interviewer' },
        { text: 'User', icon: <UsersIcon />,icon2:<ActiveUserIcon/>, link: '/internal/users' },
        { text: 'Agreements', icon: <AgreementsIcon />,icon2:<ActiveAgreementsIcon/>, link: '/internal/agreements' },
        { text: 'Finance', icon: <FinanceIcon />,icon2:<ActiveFinanceIcon/>, link: '/internal/finance' },
        { text: 'Engagement', icon: <EngagementIcon />,icon2:<ActiveEngagementIcon/>, link: '/internal/engagement' },
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
            // sx={{
            //     width: drawerWidth,
            //     flexShrink: 0,
            //     '& .MuiDrawer-paper': {
            //       width: drawerWidth,
            //       boxSizing: 'border-box',
            //       border: 'none', // Highlight: Removed border from Drawer
            //     },
            //   }}
            >
                <DrawerHeader>
                    <div
                    className='flex items-center justify-around h-full w-full'
                    >
                        <div>
                            <h1 className='text-2xl text-[#056DDC]'>Hi, Ashok</h1>
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
                 sx={ {border: 'none'}}
                >
                    {navItems.map((items) => (
                        <ListItem key={items.text} disablePadding sx={{ display: 'block' }}
                            className={`${location.pathname.startsWith(items.link) ? "bg-blue-100" : ""}`}
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
                                    className={`${location.pathname.startsWith(items.link)? "text-[#056DDC] font-semibold" : ""} ${open ? "opacity-100" : "opacity-0"}`}
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


export { NavigationLayout as InternalNavigationLayout }
