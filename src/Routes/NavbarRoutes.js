import React from 'react';
import Dashboard from '../Pages/Dashboard'
import Topology from '../Pages/Topology'
import Backup from '../Pages/BackupStore'
import Management from '../Pages/Management'
// import IoT from '../Pages/IoT'
import { FcPieChart, FcParallelTasks, FcRotateToPortrait, FcEngineering } from 'react-icons/fc'


export const NavRoutes = [
    {
        title: 'Dashboard',
        path: '/',
        icon: <FcPieChart style={{fontSize:'1.5rem'}}/>,
        cName: 'NavText',
        auth: true,
        component: Dashboard
    },
    {
        title: 'Topology',
        path: '/topology',
        icon: <FcParallelTasks style={{fontSize:'1.5rem'}}/>,
        cName: 'NavText',
        auth: true,
        component: Topology
    },
    // {
    //     title: 'IoT',
    //     path: '/iot',
    //     icon: <FcMultipleSmartphones style={{fontSize:'1.5rem'}}/>,
    //     cName: 'NavText',
    //     auth: true,
    //     component: IoT
    // },
    {
        title: 'Upgrade',
        path: '/backuprestore',
        icon: <FcRotateToPortrait style={{fontSize:'1.5rem'}}/>,
        cName: 'NavText',
        auth: true,
        component: Backup
    },
    {
        title: 'Management',
        path: '/management',
        icon: <FcEngineering style={{fontSize:'1.5rem'}}/>,
        cName: 'NavText',
        auth: true,
        // super:true,
        component: Management

    },
]


