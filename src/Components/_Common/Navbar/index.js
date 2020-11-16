import React, { useState, useContext, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { NavRoutes } from "../../../Routes/NavbarRoutes";
import { ImCross } from "react-icons/im";
import { UserLogOut } from "../../../Utility/Fetch";
import { useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Context from "../../../Utility/Reduxx";
import { Button, Tooltip } from "antd";
import { FcExternal, FcInternal } from 'react-icons/fc'
import { FcList } from 'react-icons/fc'
import { useTranslation } from 'react-i18next';


const Nav = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const showNav = state.Global.showNav
  const IsMD = state.Global.IsMD
  const [Auth, setAuth] = useState(localStorage.getItem("auth.isAuthed"));
  const ShowSuperOnNav = state.Login.Cid === '' && localStorage.getItem('authUser.cid') === 'proscend'
  const { t } = useTranslation();
  const ShowBar = () => {
    // setShowNav(!showNav);
    dispatch({
      type: "setShowNav",
      payload: {
        showNav: !showNav,
      },
    });
    
  };
  useEffect(() => {
    if (state.Global.innerWidth < 1200) {
      // setShowNav(false);
      dispatch({
        type: "setShowNav",
        payload: {
          showNav: false,
        },
      });
    } else {
      // setShowNav(true);
      dispatch({
        type: "setShowNav",
        payload: {
          showNav: true,
        },
      });
    }
    if (state.Global.innerWidth < 768) {
      dispatch({
        type: "setIsMD",
        payload: {
          IsMD: true,
        },
      });
    } else {
      dispatch({
        type: "setIsMD",
        payload: {
          IsMD: false,
        },
      });
    }
  }, [state.Global.innerWidth]);

  const updateWidthAndHeight = () => {
    dispatch({
      type: "setWindow",
      payload: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      },
    });
  };

  useEffect(() => {
  }, [showNav]);

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, [window.innerWidth]);

  useEffect(() => {
    dispatch({
      type: "setWindow",
      payload: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      },
    }); //first time window setting
    setAuth(localStorage.getItem("auth.isAuthed"));
  }, [localStorage.getItem("auth.isAuthed")]);

  const logout = async () => {
    localStorage.clear();
    await UserLogOut();
    setAuth(false);
    Swal.fire({
      title: "Sign Out Success",
      icon: "success",
      showConfirmButton: false,
      timer: 1200,
    }).then(() => {
      dispatch({ type: "setUser", payload: { User: "" } });
      history.push("/login");
    });
  };

  return (
    <div className={styles.container}>
      <div
        className={ showNav ? ( IsMD ? `${styles.navwrap} ${styles.MDshowNav}` : `${styles.navwrap}`) : ( IsMD ? `${styles.MDhideNav} `: `${styles.navwrap} ${styles.ChangeBGforHide}`)}
        // style={IsMD ? {display:'none'}: null}
      >
        <ul className={styles.navitems}>
          <li className={styles.title} style={showNav ? null: {background:'white'}}>
            {/* {showNav ? <h2>ISMS</h2> : null} */}
            {showNav ? <img src={require("../../../image/ISMS.png")} className={styles.Logo}/> : null}
            <Link to="#" className={styles.cross} onClick={ShowBar}>
              { showNav ? <ImCross /> : <FcList style={{fontSize:'1.5rem'}}/> }
            </Link>
          </li>
          {NavRoutes.map((item, index) => {
            // item.super? ShowSuperOnNav 
            if(item.super && !ShowSuperOnNav){return}
            return (
              <li className={item.navitem} key={index}>
                <Link to={item.path}><Tooltip title={item.title} placement="right" key={index}>
                  {/* {item.icon}</Tooltip> {showNav ? <span>{item.title}</span> : null} */}
                  {item.icon}</Tooltip> {showNav ? <span>{t(`ISMS.${item.title}`)} </span> : null}
                </Link>
                {/* {t('ISMS.goRegister1')} */}
              </li>
            );
          })}
        </ul>
        {Auth ? (
         showNav ? 
          <Button className={styles.LogoutBtn} onClick={logout}>
            {/* Sign Out */}
            {t('ISMS.LogOut')}
          </Button>
          :
          <Tooltip title={'Sign-out'} placement="right">
          <FcExternal style={{fontSize:'1.5rem', cursor:'pointer'}} onClick={logout}/>
          </Tooltip>
        ) : (
          showNav ? 
          <button
            className={styles.LogoutBtn}
            onClick={() => {
              history.push("/login");
            }}
          >
            {t('ISMS.Login')}
          </button>
          :
          <Tooltip title={'Sign-in'} placement="right">
          <FcInternal style={{fontSize:'1.5rem', cursor:'pointer'}} onClick={() => {
            history.push("/login");
          }}/>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Nav;
