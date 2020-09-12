import React from 'react'
import Dashboard from '../Pages/Dashboard'
import { Redirect } from "react-router-dom"

export const Routes = {
      path: '/dashboard',
      render: () => <Redirect to={'/dashboard'} />,
      component: Dashboard,
      exact: true,
      linkName: "dashboard",
    //   icon: GoDashboard,
    }
