import React,{useState,useEffect} from 'react'
import { List, Skeleton,Pagination ,Button, message } from 'antd';
import {ArticleListApi,ArticleDelApi} from '../request/api'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function ListList() {
const [list,setList]=useState([])
const [total,setTotal]=useState(0)
const [current,setCurrent]=useState(1)
const [pageSize,setPageSize]=useState(10)
const navigate=useNavigate()
const [update,setUpdate]=useState([])

//封装请求
const getList=(num)=>{
  ArticleListApi({
    num,
    count:pageSize
  }).then(res=>{
    if(res.errCode===0){
      let {arr,total,num,count}=res.data;
      setList(arr)
      setTotal(total)
      setCurrent(num)
      setPageSize(count)
    }
  })
}
 //发送请求,componentDidMount
 useEffect(()=>{
  getList(current)
 },[])
 //发送请求,componentDidUpdate
 useEffect(()=>{
  getList(current)
 },[update])

 const onChange=(pages)=>{
  //setCurrent(pages)
  getList(pages)
 }

//删除
const deFn=(id)=>{
  ArticleDelApi({id}).then(res=>{
    if(res.errCode===0){
      message.success(res.message)
      //重新刷新页面
      setUpdate(update+1)
    }
  })
}

  return (
    <div className='list_table' style={{padding:'20px'}}>
    <List
    className="demo-loadmore-list"
    itemLayout="horizontal"
    dataSource={list}
    renderItem={item => (
      <List.Item
        actions={[
            <Button type='primary' onClick={()=>navigate('/edit/'+item.id)}>编辑</Button>, 
            <Button type='danger' onClick={()=>deFn(item.id)}>删除</Button>
          ]}
      >
        <Skeleton loading={false} title={false} >
          <List.Item.Meta
            title={<a href="https://ant.design">{item.title}</a>}
            description={item.subTitle}
          />
          <div>{moment(item.date).format("YYYY-MM-DD hh:mm:ss")}</div>
        </Skeleton>
      </List.Item>
    )}
  />
  <Pagination style={{float:'right',marginTop:'20px'}} onChange={onChange} total={total} current={current} pageSize={pageSize}/>
    </div>
  )
}
