import React, {  useState, useContext } from 'react'
import { Form, Input, Button, Card } from 'antd';
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom";
import { UserLogin } from '../../../Utility/Fetch'
import Context from '../../../Utility/Reduxx'
import styles from './login.module.scss'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const LoginInput = () => {
  const { state, dispatch } = useContext(Context)  
  const history = useHistory();
  // const [Auth, setAuth] = useState (localStorage.getItem('auth.isAuthed'))

//   useEffect(()=>{
//     dispatch({type:'setLogin', payload:{IsLogin: Auth}})
// },[Auth])

  const OnFinish = async (values) => {
    const [response , data] = await UserLogin(values)
    // console.log(response, data)
    // if(response.status === 200){
    //    dispatch({type:'setLogin', payload:{IsLogin: true}})
    // }
    switch (response.status) {
      case 200:
        return Swal.fire({
          title: 'Sign In Success',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200
        })
        .then(()=>{
            localStorage.setItem('authUser.name', data.cid);
            localStorage.setItem('authUser.cid', data.cid);
            localStorage.setItem('authUser.level', data.level);
            localStorage.setItem('auth.isAuthed', true);
            localStorage.setItem('super.cid', '');
            dispatch({type:'setUser', payload:{User: data.cid}})
            // setAuth(true)
        })
        .then(() => {
            // console.log(Auth)
            // history.push('/backuprestore')
            console.log(state)
            if(state.Login.LogPath){
              history.push(state.Login.LogPath)
            }else{
              history.push('/dashboard')
            }
          })

      default:
        console.log('fail')
        return history.push('/login')
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card bodyStyle={{ width: '100%'}} className={styles.card}>
    <Form
      {...layout}
      className={styles.form}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={OnFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        className={styles.item}
        label="name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input className={styles.input}/>
      </Form.Item>

      <Form.Item
        className={styles.item}
        label="password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password className={styles.input}/>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
        {/* <Button type="primary" htmlType="submit" onClick={()=>dispatch({type:'setLogin', payload:{IsLogin: true}})}> */}
          Submit
        </Button>
      </Form.Item>
    </Form>
    </Card>
  );
};

export default LoginInput