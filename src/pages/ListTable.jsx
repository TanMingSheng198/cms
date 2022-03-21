import React,{useState,useEffect} from 'react'
import  './less/ListTable.less'
import { Table, Button, Space,message } from 'antd';
import {ArticleListApi,ArticleDelApi} from '../request/api'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


function MyTitle(props){
    return (
        <div>
        <a className='table_title' href={"www.baidu.com/ "+props.id} target="_blank">{props.title}</a>
        <p style={{color:'#999'}}>{props.subTitle}</p>
        </div>
    )
}

    
export default function ListTable() {

    //列表内容
    const [arr,setArr]=useState([])
    const navigate=useNavigate()
  //删除

    const [pagination,setPagination]=useState({current:1,pageSize:10,total:10})
    const deFn=(id)=>{
      ArticleDelApi({id}).then(res=>{
        if(res.errCode===0){
          message.success(res.message)
          //重新刷新页面
          getArticleList(1,pagination.pageSize);
        }
      })
    }
    //提取请求的代码
    const getArticleList=(current,pageSize)=>{
        ArticleListApi({
            num:current,
            count:pageSize
        }).then(res=>{
            if(res.errCode===0){
                console.log(res.data)
                //更改pagination
                let {num,count,total}=res.data;
                setPagination({
                    current:num,
                    pageSize:count,
                    total
                })
                let newArr=JSON.parse(JSON.stringify(res.data.arr))
                //声明一个空数组
                let myArr=[]

                /* 
                1.要给每个数组项加key,让key=id
                2.需要有一套标签结构，赋予一个属性
                */
               newArr.map(item=>{
                   //item.key=item.id;
                   //item.date=moment(item.date).format("YYYY-MM-DD hh:mm:ss")
                   //item.mytitle="<div><Link className='table_title' to='/'>${item.title}</Link>,<p style={{color:'#999'}}>${item.subTitle}</p></div>";
                    let obj={
                        key:item.id,
                        date:moment(item.date).format("YYYY-MM-DD hh:mm:ss"),
                        mytitle:<MyTitle title={item.title} subTitle={item.subTitle} id={item.id}/>
                    }
                    myArr.push(obj)
                })
               console.log(newArr)
               setArr(myArr)
            }
        })
    }

      //请求文章列表
      useEffect(()=>{
        getArticleList(pagination.current,pagination.pageSize);
      },[])

      //分页的函数
      const pageChange=(arg)=>{
        getArticleList(arg.current,arg.pageSize);
      }

      //每一列的数据内容
    const columns = [
        {
          title: '姓名',
          dataIndex: 'mytitle',
          key: 'mytitle',
          width:'60%',
          render: text => <div >{text}</div> ,
        },
        
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
          render: text => <p>{text}</p> ,
        },
        
        {
          title: 'Action',
          key: 'action',
          render: text => {
              return <Space size="middle">
              <Button type='primary' onClick={()=>navigate('/edit/'+text.key)}>编辑</Button>
              <Button type='danger' onClick={()=>deFn(text.key)}>删除</Button>
            </Space>
          }
        },
      ];

  return (
    <div className='list_table'>
        <Table showHeader={false} columns={columns} dataSource={arr} onChange={pageChange} pagination={pagination} />
    </div>//改变showHeader的值可以显示和隐藏表头
  )
}





