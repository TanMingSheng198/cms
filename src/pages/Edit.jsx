import React ,{useEffect,useState}from 'react'
import { PageHeader, Button, Modal,Form, Input, message} from 'antd';
import moment from 'moment';
import E from 'wangeditor'
import {ArticleAddApi,ArticleSearchApi,ArticleUpdateApi} from '../request/api'
import { useParams,useNavigate,useLocation } from 'react-router-dom';


let editor=null

export default function Edit() {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false);
  const location=useLocation()
  const navigate=useNavigate()
  const [form] = Form.useForm();
  const params=useParams()
  console.log(location)
  //对话框点击了提交
  const handleOk = () => {
    
    form
          .validateFields()//校验字段
          .then((values) => {
            //form.resetFields();//重置字段
            let {title,subTitle}=values;
            //地址栏有id表示现在想要更新一篇文章
            if(params.id){
              //更新文章的请求
              ArticleUpdateApi({
                title,subTitle,content,id:params.id
              }).then(res=>{
                //关闭对话框
                setIsModalVisible(false);
                if(res.errCode===0){
                  message.success(res.message)
                  //跳回list页面
                  navigate('/listlist')
                }else{
                  message.error(res.message)
                }
                
              })
            }else{
              //添加文章请求
            ArticleAddApi({title,subTitle,content}).then(res=>{
              //关闭对话框
              setIsModalVisible(false);
              if(res.errCode===0){
                message.success(res.message)
                //跳回list页面
                navigate('/listlist')
              }else{
                message.error(res.message)
              }
            })
            }
            
          })
          .catch(() => {
            return;
          });
  };

 
//模拟componentDIdMount
useEffect(()=>{
  editor = new E("#div1")
  editor.config.onchange = (newHtml) => {
    setContent(newHtml)
  }
  editor.create()

  //根据地址栏id做请求
  if(params.id){
    ArticleSearchApi({id:params.id}).then(res=>{
      if(res.errCode===0){
        let {title,subTitle}=res.data;
        editor.txt.html(res.data.content)//重新设置编辑器内容
        setTitle(res.data.title)
        setSubTitle(res.data.subTitle)
      }
    })
  }


  return () => {
    // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
    editor.destroy()
  }
},[location.pathname])

  return (
    <div>
      <PageHeader
      ghost={false}
      onBack={params.id ? () => window.history.back():null}
      title="文章编辑"
      subTitle={"当前日期: "+moment(new Date()).format("YYYY-MM-DD hh:mm:ss")}
      extra={<Button key="1" type="primary" onClick={() => setIsModalVisible(true)}>提交文章</Button>}
    >
      </PageHeader>
      <div id="div1" style={{padding:'0 20px 20px',background:'#fff'}}></div>
      <Modal zIndex={99999} title="填写文章标题" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} okText="提交" cancelText="取消">
        
      <Form
      form={form}
      name="basic"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 21 }}
      autoComplete="off"
      initialValues={{title,subTitle}}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请填写标题' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="副标题"
        name="subTitle"
      >
        <Input />
      </Form.Item>


    </Form>

      </Modal>
    </div>
  )
}
