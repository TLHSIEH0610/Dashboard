import React, { useReducer, createContext } from 'react'

//建立全局Context
const Context = createContext()
export default Context

//建立全局Reducer
// const iniState = {IsLogin:false, id: 'id'}
const iniState = { Login:{IsLogin:false}, Topology:{id: 'id', deviceStatusByID:''}, BackupRestore:{BackupReq:''} }
const reducer = (state = iniState, action) => {
    let newState
    switch(action.type){
        case 'setLogin':
            newState = {...state}
            newState.Login.IsLogin = action.payload.IsLogin
            return newState
        case 'id':
            newState = {...state}
            newState.Topology.id = action.payload.id
            return newState
        case 'deviceStatusByID':
            newState = {...state}
            newState.Topology.deviceStatusByID = action.payload.deviceStatusByID
            return newState
        case 'updateCloud':
            newState = {...state}
            newState.BackupRestore.BackupReq = action.payload.BackupReq
            return newState
        default:
            return state
    }
}


export const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, iniState)
    return(
        <Context.Provider value={{state, dispatch}}> {children} </Context.Provider>
    )
}