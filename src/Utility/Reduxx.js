import React, { useReducer, createContext } from "react";

//建立全局Context
const Context = createContext();
export default Context;

//建立全局Reducer
// const iniState = {IsLogin:false, id: 'id'}
const iniState = {
  Login: { IsLogin: false, LogPath: "/dashboard", User: null, Cid: "" },
  Topology: { id: "id", deviceStatusByID: "" },
  BackupRestore: {
    BackupReq: "",
    ActionStatusList: "",
    IsActionUpdated: "false",
  },
};

const reducer = (state = iniState, action) => {
  let newState;
  switch (action.type) {
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
    default:
      return state;
  }
};
// dispatch({type:'ActionStatusList', payload:{BackupRestore: responseData}})
export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, iniState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {" "}
      {children}{" "}
    </Context.Provider>
  );
};
