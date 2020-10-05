
import { Redirect } from "react-router-dom"
import React, {useContext} from 'react'
import context from './Reduxx'
import axios from 'axios'



//  http://192.168.0.95:8000/login?user={"name":"super@proscend.com","password":"70746615"}

export async function UserLogin(Account) {
    let Account_JSON = JSON.stringify(Account)
    let url = `/login?user=${Account_JSON}`
    let response
    let data
    
    // axios.get(url).then((res)=>{return res}) 用axios會反回undefined ??

    try{
        response = await fetch(url, { credentials: 'include' })
        data = await response.json();
        return [response,data.response]
    }
    catch(error){
        console.log('error: ', error);
        return [response,data]
    }
}


export async function UserLogOut() {
    const url = "/logout"
    // const {state} = useContext(context)
    let response
    try{
        response = await fetch(url, { credentials: 'include' })
        console.log(response)
        localStorage.clear()
        // dispatch({type:'setUser', payload:{Cid: ''}})
        return response
    }
    catch(error){
        console.log('error: ', error);
        response = error
        return response
    }
}


export async function GetDeviceStatus(ID){
    const filterid =  {
        device_status: {
          filter: {
            id:ID 
          },
          nodeInf: {},
          obj: {
            status: {},
          },
        }
    };
    const filteridJSON = JSON.stringify(filterid)
    const url =`/cmd?get=${filteridJSON}`
    // console.log(url)
    let response
    let data
    // const history = useHistory()
    // const { dispatch } = useContext(Context) 

    try{
        response = await fetch(url, { credentials: 'include' })
        data = await response.json();
        // console.log(data)
        return[response, data]
    }
    catch(error){
        // console.log('error: ', error);

        if(error.response.status === 401){
            // dispatch({type:'setLogin', payload:{IsLogin: false}})
            UserLogOut()
            // return  history.push('/login')
            return <Redirect to='/login'/>
        }
        return response
    }
}