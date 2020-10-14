import React, { useContext } from 'react'
import { Form, Input, Button, Card } from 'antd';
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom";
import { UserLogin } from '../../../Utility/Fetch'
import Context from '../../../Utility/Reduxx'
import styles from './login.module.scss'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const layout = {

  wrapperCol: {
    span: 10,
    offset: 6,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 16,
  },
}

const LoginInput = () => {
  const { state, dispatch } = useContext(Context)  
  const history = useHistory();


  const OnFinish = async (values) => {
    const [response , data] = await UserLogin(values)
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
        })
        .then(() => {
            // console.log(state)
            if(state.Login.LogPath){
              history.push(state.Login.LogPath)
            }else{
              history.push('/')
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
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username"/>
      </Form.Item>

      <Form.Item
        className={styles.item}
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />}/>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Log-in
        </Button>
      </Form.Item>
     
    </Form>
    <div className={styles.registerBtn} onClick={()=>{history.push('/register')}}> <span>Don't have an account?</span> Register and enjoy free trail </div>
    </Card>
  );
};

export default LoginInput