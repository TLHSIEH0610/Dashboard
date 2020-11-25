import React, { useState, useContext, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { NavRoutes } from "../../../Routes/NavbarRoutes";
import { ImCross } from "react-icons/im";
// import { UserLogOut } from "../../../Utility/Fetch";
// import axios from 'axios'
import { useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Context from "../../../Utility/Reduxx";
import { Button, Tooltip } from "antd";
import { FcExternal } from "react-icons/fc";
import { FcList } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { UserLogOut } from "../../../Utility/Fetch";

const Nav = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const [uploading, setUploading] = useState(false);
  const showNav = state.Global.showNav;
  const IsMD = state.Global.IsMD;
  // const [Auth, setAuth] = useState(localStorage.getItem("auth.isAuthed"));
  // const ShowSuperOnNav =
  //   state.Login.Cid === "" &&
  //   localStorage.getItem("authUser.cid") === "proscend";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {}, [showNav]);

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  useEffect(() => {
    dispatch({
      type: "setWindow",
      payload: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      },
    }); //first time window setting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Login.IsLogin]);

  return (
    <div className={styles.container}>
      <div
        className={
          showNav
            ? IsMD
              ? `${styles.navwrap} ${styles.MDshowNav}`
              : `${styles.navwrap}`
            : IsMD
            ? `${styles.MDhideNav} `
            : `${styles.navwrap} ${styles.ChangeBGforHide}`
        }
        // style={IsMD ? {display:'none'}: null}
      >
        <ul className={styles.navitems}>
          <li
            className={styles.title}
            style={showNav ? null : { background: "white" }}
          >
            {/* {showNav ? <h2>ISMS</h2> : null} */}
            {showNav ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  alt=""
                  src={require("../../../image/Logo-Proscend-White-300.png")}
                  className={styles.LogoProscend}
                />
                <img
                  alt=""
                  src={require("../../../image/ISMS.png")}
                  className={styles.Logo}
                />
              </div>
            ) : null}
            <Link to="#" className={styles.cross} onClick={ShowBar}>
              {showNav ? (
                <ImCross />
              ) : (
                <FcList style={{ fontSize: "1.5rem" }} />
              )}
            </Link>
          </li>

          {
            NavRoutes.map((item,index)=>{
              return (
                <li className={item.navitem} key={index}>
                  <Link to={item.path}>
                    <Tooltip title={item.title} placement="right" key={index}>
                      {/* {item.icon}</Tooltip> {showNav ? <span>{item.title}</span> : null} */}
                      {item.icon}
                    </Tooltip>
                    {showNav ? <span>{t(`ISMS.${item.title}`)} </span> : null}
                  </Link>
                  {/* {t('ISMS.goRegister1')} */}
                </li>
              );
            })
          }

          {/* {NavRoutes.map((item, index) => {
            // item.super? ShowSuperOnNav
            if (item.super && !ShowSuperOnNav) {
              return;
            }
            return (
              <li className={item.navitem} key={index}>
                <Link to={item.path}>
                  <Tooltip title={item.title} placement="right" key={index}>
                    {item.icon}
                  </Tooltip>{" "}
                  {showNav ? <span>{t(`ISMS.${item.title}`)} </span> : null}
                </Link>
              </li>
            );
          })} */}
          
        </ul>
        {
          state.Login.IsLogin &&
            (showNav ? (
              <Button
                className={styles.LogoutBtn}
                loading={uploading}
                onClick={async () => {
                  setUploading(true);
                  dispatch({ type: "setLogin", payload: { IsLogin: false } });
                  await UserLogOut();
                  // setAuth(false);

                  Swal.fire({
                    title: "Sign Out Success",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1200,
                  });
                  setUploading(false);
                  // dispatch({ type: "setUser", payload: { User: "" } });

                  history.push("/userlogin");
                }}
              >
                {t("ISMS.LogOut")}
              </Button>
            ) : (
              <Tooltip title={"Sign-out"} placement="right">
                <FcExternal
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                  onClick={async () => {
                    setUploading(true);
                    dispatch({ type: "setLogin", payload: { IsLogin: false } });
                    await UserLogOut();
                    // setAuth(false);
                    Swal.fire({
                      title: "Sign Out Success",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 1200,
                    });
                    setUploading(false);
                    // dispatch({ type: "setUser", payload: { User: "" } });

                    history.push("/userlogin");
                  }}
                />
              </Tooltip>
            ))
          // : (
          //   showNav &&
          //   <button
          //     className={styles.LogoutBtn}
          //     onClick={() => {
          //       history.push("/login");
          //     }}
          //   >
          //     {t('ISMS.Login')}
          //   </button>
          // :
          // <Tooltip title={'Sign-in'} placement="right">
          // <FcInternal style={{fontSize:'1.5rem', cursor:'pointer'}} onClick={() => {
          //   history.push("/login");
          // }}/>
          // </Tooltip>
        }
      </div>
    </div>
  );
};

export default Nav;
