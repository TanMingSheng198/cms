import React from 'react'
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Link,useNavigate} from 'react-router-dom'
import "./less/Login.less"
import { LoginApi } from '../request/api';
export default function Login() {
    const navigate=useNavigate()
    const onFinish = (values) => {
      
      LoginApi({
        username:values.username,
        password:values.password
      }).then(res=>{
        console.log(res)
        if(res.errCode===0){
          message.success('登陆成功，即将跳转到主页')
          //存储数据
          localStorage.setItem('avatar',res.data.avatar)
          localStorage.setItem('cms-token',res.data['cms-token'])
          localStorage.setItem('editable',res.data.editable)
          localStorage.setItem('player',res.data.player)
          localStorage.setItem('username',res.data.username)
          //跳转到根路径
          setTimeout(()=>{
            navigate('/')
          },1500)
        }else{
          message.error('用户或密码错误')
        }
      })
    };
  
    
  return (
    <div className='login'>
      <div className='login_box'>
        <Form
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 17,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input.Password size='large' prefix={<LockOutlined className="site-form-item-icon" />} placeholder="输入密码 " />
          </Form.Item>
          <Form.Item 
            wrapperCol={{
              offset: 5,
              span: 17,
            }}>
            <Link to="/register">还没账号？立即注册</Link>
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 11,
              span: 13,
            }}
          >
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

            
          <Form.Item
            wrapperCol={{
              offset: 12,
              span: 12,
            }}
          >
            <Button size='large' type="primary" htmlType="submit">登录</Button>
          </Form.Item>
        </Form>
        </div>
    </div>
  )
}
