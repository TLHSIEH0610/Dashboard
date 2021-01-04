import React, { useContext, useEffect, Fragment } from "react";
import styles from "./Navbar.module.scss";
import { NavRoutes } from "../../../Routes/NavbarRoutes";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
// import { UserLogOut } from "../../../Utility/Fetch";
// import axios from 'axios'
import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
import Context from "../../../Utility/Reduxx";
import { Tooltip } from "antd";
// import { FcExternal } from "react-icons/fc";
import { useTranslation } from "react-i18next";
// import { UserLogOut } from "../../../Utility/Fetch";
// import { BiLogOut } from "react-icons/bi";

const Nav = () => {
  // const history = useHistory();
  const { state, dispatch } = useContext(Context);
  // const [uploading, setUploading] = useState(false);
  const showNav = state.Global.showNav;
  const IsMD = state.Global.IsMD;
  const User = localStorage.getItem("authUser.name");
  const level = localStorage.getItem("authUser.level");
  // const [level, setLevel] = useState(undefined)
  // console.log(state.Login.IsLogin)
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
  // useEffect(()=>{
  //   setLevel(localStorage.getItem("authUser.level"))
  // },[])
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
    state.Login.IsLogin &&
    User &&(
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
          <div
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
                  style={{ marginRight: "20px" }}
                />
                <img
                  alt=""
                  src={require("../../../image/OsmartNavLogo.png")}
                  className={styles.Logo}
                />
              </div>
            ) : null}

            <Link to="#" className={styles.cross} onClick={ShowBar}>
              {showNav ? (
                <BiChevronsLeft
                  className={styles.BiChevronsLeft}
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <BiChevronsRight
                  className={styles.BiChevronsRight}
                  style={{
                    fontSize: "2.3rem",
                    cursor: "pointer",
                    // marginRight: "3px",
                    color: "#042b57",
                    marginLeft: "2%",
                  }}
                />
              )}
            </Link>
          </div>

          <ul className={styles.navitems}>
            {level && NavRoutes.map((item, index) => {
              if(item.super && (level!=='super_super' && level !== 'super' && level !== 'admin')){
                return
              }
              return (
                <Fragment  key={index}>
                {<li className={item.navitem} key={index}>
                  <Link to={item.path}>
                    <Tooltip title={item.title} placement="right" key={index}>
                      {/* {item.icon}</Tooltip> {showNav ? <span>{item.title}</span> : null} */}
                      <span
                        style={
                          showNav
                            ? { margin: 0, width: "auto" }
                            : { color: "#042b57", margin: 0, width: "auto" }
                        }
                      >
                        {item.icon}
                      </span>
                    </Tooltip>
                    {showNav ? (
                      <span className={"Oswald"} style={{ textAlign: "left" }}>
                        {t(`ISMS.${item.title}`)}{" "}
                      </span>
                    ) : null}
                  </Link>
                  {/* {t('ISMS.goRegister1')} */}
                </li>}
                </Fragment>
              );
            })}

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

          {/* Logout */}

          {/* {
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
                <BiLogOut
                  style={{
                    fontSize: "1.6rem",
                    cursor: "pointer",
                    marginRight: "8px",
                    color: "#042b57",
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
        } */}
        </div>
        <p className={styles.version}>Ver.KS201231</p>
      </div>
    )
  );
};

export default Nav;
