import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import Context from '../Utility/Reduxx'
import { useHistory } from "react-router-dom";
import { UserLogOut } from '../Utility/Fetch'

const useURLloader = (url, dep) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const { dispatch } = useContext(Context) 

    useEffect(()=>{
        setLoading(true)
        axios.get(url).then((res)=>{
            console.log(res)
            setData(res.data)
            setLoading(false)
            console.log(loading, data)
        })
        .catch((error)=>{
            console.log(error)
            if(error.response.status === 401){
                dispatch({type:'setLogin', payload:{IsLogin: false}})
                UserLogOut()
                history.push('/login')    
            }

        })  
        console.log(dep)
    }, [dep])
    return [loading, data]
}

export default useURLloader