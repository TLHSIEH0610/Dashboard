import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Context from "../Utility/Reduxx";
import { useHistory, useLocation } from "react-router-dom";
import { UserLogOut } from "../Utility/Fetch";



const useURLloader = (url, urldata, dep) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const location = useLocation();  

  
  useEffect(() => {
    if(url, urldata){
      setLoading(true);
      const config = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: url,
        data: JSON.parse(urldata),
      }
      // console.log(config)
      axios(config)
        .then((res) => {
          // console.log( '執行了',url)
          setData(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response && error.response.status === 401) {
            dispatch({
              type: "LogPath",
              payload: { LogPath: location.pathname },
            });
            UserLogOut();
            history.push("/userlogin");                                                                         
          } else {
            history.push("/internalerror");
          }
        });
    }

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, urldata]);

  return [loading, data];
};

export default useURLloader;
