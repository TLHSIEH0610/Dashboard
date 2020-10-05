import React from 'react';
import {GoDashboard} from 'react-icons/go'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {FiSettings} from 'react-icons/fi'
import { MdSettingsBackupRestore, MdCastConnected } from 'react-icons/md'
import Dashboard from '../Pages/Dashboard'
import Track from '../Pages/Track'
import Topology from '../Pages/Topology'
import Backup from '../Pages/BackupStore'
import {ApartmentOutlined} from '@ant-design/icons'
import Management from '../Pages/Management'
import IoT from '../Pages/IoT'


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
        icon: <ApartmentOutlined />,
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
        title: 'IoT',
        path: '/iot',
        icon: <MdCastConnected/>,
        cName: 'NavText',
        auth: true,
        component: IoT
    },
    {
        title: 'Device Backup',
        path: '/backuprestore',
        icon: <MdSettingsBackupRestore/>,
        cName: 'NavText',
        auth: true,
        component: Backup
    },
    {
        title: 'Management',
        path: '/management',
        icon: <FiSettings/>,
        cName: 'NavText',
        auth: true,
        component: Management
    },

    // {
    //     title: 'Login',
    //     path: '/login',
    //     icon: <FiSettings/>,
    //     cName: 'NavText',
    //     component: Login
    // }
]


