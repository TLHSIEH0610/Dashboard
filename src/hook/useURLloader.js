import { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import Context from '../Utility/Reduxx'
import { useHistory,useLocation } from "react-router-dom";
import { UserLogOut } from '../Utility/Fetch'

const useURLloader = (url, dep) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const { dispatch } = useContext(Context) 
    const location = useLocation();

    useEffect(()=>{
        setLoading(true)
        axios.get(url).then((res)=>{
            console.log( '執行了',url)
            setData(res.data)
            setLoading(false)
        })
        .catch((error)=>{
            console.log(error)
            setLoading(false)
            if(error.response.status === 401){
                dispatch({type:'LogPath', payload:{LogPath: location.pathname}})
                UserLogOut()
                history.push('/login')    
            }
        }) 
    }, [dep, url])
    
    return [loading, data]
}

export default useURLloader