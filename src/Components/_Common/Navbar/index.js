import React, { useState, Fragment, useContext, useEffect } from 'react';
import styles from './Navbar.module.scss'
import {BsReverseLayoutTextSidebarReverse} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { NavRoutes } from '../../../Routes/NavbarRoutes'
import  { ImCross } from 'react-icons/im'
import { UserLogOut } from '../../../Utility/Fetch'
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2'
import Context from '../../../Utility/Reduxx'
import {Button} from 'antd'


const Nav = () => {
  const history = useHistory()
  const { dispatch } = useContext(Context)  
  const [show, setShow] = useState(false)
  const [Auth, setAuth] = useState(localStorage.getItem('auth.isAuthed'))
  const ShowBar = ()=>{setShow(!show)}
  useEffect(()=>{
    setAuth(localStorage.getItem('auth.isAuthed'))
  }, [localStorage.getItem('auth.isAuthed')])

  const logout = async () => {
    localStorage.clear();
    await UserLogOut()
    setAuth(false)
    Swal.fire({
      title: 'Sign Out Success',
      icon: 'success',
      showConfirmButton: false,
      timer: 1200,
    })
    .then(()=>{
      dispatch({type:'setUser', payload:{User: ''}})
      history.push('/login')
    })
  }

  // useEffect(()=>{
  //   const isAuthed = localStorage.getItem('auth.isAuthed')
  // })

  return (
    <Fragment>
      <div className={show ? `${styles.bar} ${styles.active}` : `${styles.bar}`}><Link to="#" onClick={ ShowBar }><BsReverseLayoutTextSidebarReverse/></Link></div>
      <div className={show ? `${styles.navwrap} ${styles.active}` : `${styles.navwrap}` }>
          <ul className={styles.navitems}>
            <li className={styles.title}> <h2>ISMS</h2> <Link to="#" className={styles.cross} onClick={ ShowBar }><ImCross /></Link> </li>
            { NavRoutes.map((item,index)=>{
              return (<li className={item.navitem} key={index}> <Link to={item.path}>{item.icon} <span>{item.title}</span></Link></li>)
            }) }
          </ul>
          {/* <button className={styles.LogoutBtn} onClick={logout} >Sign Out</button>     */}
          {Auth ? <Button className={styles.LogoutBtn} onClick={logout} >Sign Out</Button> : <button className={styles.LogoutBtn} onClick={()=>{history.push('/login')}} >Sign In</button> }           
      </div>
    </Fragment>
  )

}

export default Nav