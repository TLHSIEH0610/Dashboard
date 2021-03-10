import React from 'react';
import Dashboard from '../Pages/Dashboard'
import Topology from '../Pages/Topology'
import Backup from '../Pages/BackupStore'
import Management from '../Pages/Management'
import { AiFillSetting } from 'react-icons/ai'
import { MdCastConnected } from 'react-icons/md'
import { FaFileUpload, FaChartLine } from 'react-icons/fa'


export const NavRoutes = [
    {
        title: 'DASHBOARD',
        path: '/',
        icon: <FaChartLine style={{fontSize:'1.5rem'}}/>,
        cName: 'NavText',
        level:['super','super_super','admin','set','get'],
        component: Dashboard
    },
    {
        title: 'TOPOLOGY',
        path: '/topology',
        icon: <MdCastConnected style={{fontSize:'1.5rem'}}/>,
        cName: 'NavText',
        level:['super','super_super','admin','set','get'],
        component: Topology
    },
    {
        title: 'UPGRADE',
        path: '/backuprestore',
        icon: <FaFileUpload style={{fontSize:'1.5rem'}}/>,
        cName: 'NavText',
        level:['super','super_super','admin','set'],
        component: Backup
    },
    {
        title: 'MANAGEMENT',
        path: '/management',
        icon: <AiFillSetting style={{fontSize:'1.6rem'}}/>,
        cName: 'NavText',
        level:['super','super_super','admin'],
        component: Management

    },
]


