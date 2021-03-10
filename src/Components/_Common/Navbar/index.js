import React, { useContext, useEffect, Fragment } from "react";
import styles from "./Navbar.module.scss";
import { NavRoutes } from "../../../Routes/NavbarRoutes";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import Context from "../../../Utility/Reduxx";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";


const Nav = () => {
  // const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const showNav = state.Global.showNav;
  const IsMD = state.Global.IsMD;
  const User = localStorage.getItem("authUser.name");
  const level = localStorage.getItem("authUser.level");
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
      dispatch({
        type: "setShowNav",
        payload: {
          showNav: false,
        },
      });
    } else {
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
    User && (
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
        >
          <div
            className={styles.title}
            style={showNav ? null : { background: "white" }}
          >
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
            {level &&
              NavRoutes.map((item, index) => {
                if (!item.level.includes(level)) {
                  return;
                }
                return (
                  <Fragment key={index}>
                    {
                      <li className={item.navitem} key={index} >
                        <Link to={item.path}>
                          <Tooltip
                            title={item.title}
                            placement="right"
                            key={index}
                          >
                            <span
                              style={
                                showNav
                                  ? { margin: 0, width: "auto" }
                                  : {
                                      color: "#042b57",
                                      margin: 0,
                                      width: "auto",
                                    }
                              }
                            >
                              {item.icon}
                            </span>
                          </Tooltip>
                          {showNav ? (
                            <span
                              className={"Oswald"}
                              style={{ textAlign: "left" }}
                            >
                              {t(`ISMS.${item.title}`)}{" "}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    }
                  </Fragment>
                );
              })}
          </ul>

        </div>
        <p className={styles.version}>Ver.210310</p>
      </div>
    )
  );
};

export default Nav;
