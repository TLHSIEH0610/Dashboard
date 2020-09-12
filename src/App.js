import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
// import Dashboard from "./Pages/Dashboard";
import Nav from "./Components/_Common/Navbar";
import "./App.scss";
import Login from "./Pages/login";
import Header from "./Components/_Common/Header"
import { Provider } from './Utility/Reduxx'
import { NavRoutes } from './Routes/NavbarRoutes'
import WrongPage from './Pages/WrongPage'
import 'antd/dist/antd.css'


const App = () => {

  return (
    <BrowserRouter>
      <Provider>
        <div className="container_">
          <div>
            <Nav />
          </div>
          <div className="content">
            <Header />

            <Switch>
                <Route path="/login" exact component={Login}></Route>
              {NavRoutes.map((item, index) => {
                return <Route key={index} path={item.path} exact render={() =>
                  (localStorage.getItem('auth.isAuthed') ? <item.component/> : <Redirect to= '/login'/>)} />
              })}
              <Route component={WrongPage}></Route>
            </Switch>


          </div>
        </div>
      </Provider>
    </BrowserRouter>
  )
}

export default App;
