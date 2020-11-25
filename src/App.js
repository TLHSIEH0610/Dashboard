import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
// import Dashboard from "./Pages/Dashboard";
import Nav from "./Components/_Common/Navbar";
import "./App.scss";
import Login from "./Pages/login";
import Register from './Pages/Register'
import Header from "./Components/_Common/Header";
import { Provider } from "./Utility/Reduxx";
import { NavRoutes } from "./Routes/NavbarRoutes";
import WrongPage from "./Pages/WrongPage";
import InternalError from "./Pages/WrongPage/InternalFail";
// import Management from './Pages/Management'
import "antd/dist/antd.css";


const App = () => {


  return (
    <BrowserRouter>
      <Provider>
        <div className="container_">
          <div>
            <Nav />
          </div>
          <div className="rightPage">
            <Header/>
            <div className="content">
              <Switch>
           
                {/* <Route path="/management" exact component={Management}></Route> */}
                {/* <Route path="/management" exact render={() =>
                        localStorage.getItem("auth.isAuthed") ? (
                          <Management />
                        ) : (
                          <Redirect to="/login" />
                        )
                      }></Route> */}
                <Route path="/userlogin" exact component={Login}></Route>
                <Route path="/register" exact component={Register}></Route>
                <Route path="/internalerror" exact component={InternalError}></Route>
                {NavRoutes.map((item, index) => {
                  return (
                    <Route
                      key={index}
                      path={item.path}
                      exact
                      render={() =>
                        localStorage.getItem("auth.isAuthed") ? (
                          <item.component />
                        ) : (
                          <Redirect to="/userlogin" />
                        )
                      }
                    />
                  );
                })}
                <Route component={WrongPage}></Route>
                
              </Switch>
            </div>
          </div>
        </div>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
