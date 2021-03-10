import React, { useState } from 'react';
// import RegisterC from '../../Components/_Specific/Register'
import HelpNav from './Components/HelpNav'
import { Layout } from 'antd';
import styles from "./menu.module.scss";
import HelpTopologyC from './Components/HelpTopologyDevice'
import HelpManagement from './Components/HelpManagement'
import HelpUpgrade from './Components/HelpUpgrade'
import HelpRepository from './Components/HelpRepository'
import HelpDashboard from './Components/HelpDashboard'
import HelpBasic from './Components/HelpBasic'
import HelpSetting from './Components/HelpSetting'
import HelpRouterStatus from './Components/HelpRouterStatus'
const { Header, Footer, Sider, Content } = Layout;

const Menu = () => {
    const [CurrentDisplay, setCurrentDisplay] = useState('Overview')

    return (

        <Layout style={{ minHeight: '100vh' }}>
            <Sider  >
                <div className="logo" />
                <HelpNav setCurrentDisplay={setCurrentDisplay}/>
            </Sider>
            <Layout className={styles.sitelayout}>
                <Header className={styles.sitebackground} style={{ padding: 0 }} > <h1>{CurrentDisplay}</h1> </Header>
                <Content style={{ margin: '20px 16px' }}>
                    {CurrentDisplay==='Overview' && <HelpBasic/>}
                    {CurrentDisplay ==='Devices' && <HelpTopologyC/>}
                    {CurrentDisplay ==='Management' && <HelpManagement/>}
                    {CurrentDisplay==='UPGRADE' && <HelpUpgrade/>}
                    {CurrentDisplay==='FileRepository' && <HelpRepository/>}
                    {CurrentDisplay==='Dashboard' && <HelpDashboard/>}
                    {CurrentDisplay==='Setting' && <HelpSetting/>}
                    {CurrentDisplay==='Router Status' && <HelpRouterStatus/>}
                </Content>
                <Footer style={{ textAlign: 'center' }}>Proscend Osmart ©2021</Footer>
            </Layout>
        </Layout>
    )
}

export default Menu
