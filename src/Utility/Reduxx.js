import React, { useReducer, createContext } from "react";

//建立全局Context
const Context = createContext();
export default Context;

//建立全局Reducer
const iniState = {
  Global: { innerWidth:'', innerHeight:'', IsMD: false, showNav: true },
  Login: { IsLogin: false, LogPath: "/", User: null, Cid: "" },
  Topology: { id: "id", deviceStatusByID: "", health: null, strength: null },
  BackupRestore: {
    BackupReq: "",
    ActionStatusList: "",
    IsActionUpdated: "false",
  },
};

const reducer = (state = iniState, action) => {
  let newState;
  switch (action.type) {
    case "setWindow":
      newState = { ...state };
      newState.Global.innerWidth = action.payload.innerWidth;
      newState.Global.innerHeight = action.payload.innerHeight;
      return newState;
    case "setLogin":
      newState = { ...state };
      newState.Login.IsLogin = action.payload.IsLogin;
      return newState;
    case "setUser":
      newState = { ...state };
      newState.Login.User = action.payload.User;
      return newState;
    case "setCid":
      newState = { ...state };
      newState.Login.Cid = action.payload.Cid;
      return newState;
    case "LogPath":
      newState = { ...state };
      newState.Login.LogPath = action.payload.LogPath;
      return newState;
    case "id":
      newState = { ...state };
      newState.Topology.id = action.payload.id;
      return newState;
    case "deviceStatusByID":
      newState = { ...state };
      newState.Topology.deviceStatusByID = action.payload.deviceStatusByID;
      return newState;
    case "updateCloud":
      newState = { ...state };
      newState.BackupRestore.BackupReq = action.payload.BackupReq;
      return newState;
    case "ActionStatusList":
      newState = { ...state };
      newState.BackupRestore.ActionStatusList = action.payload.ActionStatusList;
      return newState;
    case "IsActionUpdated":
      newState = { ...state };
      newState.BackupRestore.IsActionUpdated = action.payload.IsActionUpdated;
      return newState;
    case "setPietoTopo":
      newState = { ...state };
      newState.Topology.health = action.payload.health;
      newState.Topology.strength = action.payload.strength;
      return newState;
    case "setIsMD":
      newState = { ...state };
      newState.Global.IsMD = action.payload.IsMD;
      return newState;
    // case "setMDMenue":
    //   newState = { ...state };
    //   newState.Global.MDMenue = action.payload.MDMenue;
    //   return newState;
    case "setShowNav":
      newState = { ...state };
      newState.Global.showNav = action.payload.showNav;
      return newState;
    default:
      return state;
  }
};
// dispatch({type:'ActionStatusList', payload:{BackupRestore: responseData}})
export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, iniState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
