import React from 'react'
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Link,useNavigate} from 'react-router-dom'
import "./less/Login.less"
import { RegisterApi } from '../request/api';
export default function Register() {

    const navigate=useNavigate()
    const onFinish = (values) => {
      console.log('Success:', values);
      RegisterApi({
        username:values.username,
        password:values.password
      }).then(res=>{
        console.log(res)
        if(res.errCode===0){
          message.success('注册成功');
          //跳到登录页
          setTimeout(()=>navigate('/login'),1500)
        }else{
          message.error('该用户已存在');
        }
      })
    };
  
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
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
          onFinishFailed={onFinishFailed}
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
          name="confirm"
          label="请确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请再次确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
  
                return Promise.reject(new Error('两次输入密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password size='large' prefix={<LockOutlined className="site-form-item-icon" />} placeholder="请确认密码 "/>
        </Form.Item>

          <Form.Item 
            wrapperCol={{
              offset: 5,
              span: 17,
            }}>
            <Link to="/login">已有帐号，前往登录</Link>
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
            <Button size='large' type="primary" htmlType="submit">立即注册</Button>
          </Form.Item>
        </Form>
        </div>
    </div>
  )
}
