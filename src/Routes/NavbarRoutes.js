import React from 'react';
import {GoDashboard} from 'react-icons/go'
import {GrTree} from 'react-icons/gr'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {FiSettings} from 'react-icons/fi'
import Dashboard from '../Pages/Dashboard'
import Track from '../Pages/Track'
import Topology from '../Pages/Topology'
import Backup from '../Pages/BackupStore'


export const NavRoutes = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <GoDashboard/>,
        cName: 'NavText',
        auth: true,
        component: Dashboard
    },
    {
        title: 'Topology',
        path: '/topology',
        icon: <GrTree/>,
        cName: 'NavText',
        auth: true,
        component: Topology
    },
    {
        title: 'Track',
        path: '/track',
        icon: <FaMapMarkerAlt/>,
        cName: 'NavText',
        auth: true,
        component: Track
    },
    {
        title: 'Setting',
        path: '/setting',
        icon: <FiSettings/>,
        cName: 'NavText',
        auth: true,
        component: 'Setting'
    },
    {
        title: 'Device Backup',
        path: '/backuprestore',
        icon: <FiSettings/>,
        cName: 'NavText',
        auth: true,
        component: Backup
    }
    // {
    //     title: 'Login',
    //     path: '/login',
    //     icon: <FiSettings/>,
    //     cName: 'NavText',
    //     component: Login
    // }
]


