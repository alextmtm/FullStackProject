import { useState, useEffect } from 'react'
import {deleteStudent, getAllStudents} from './client';

import './App.css';

import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, PlusOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Breadcrumb, Layout, Menu, theme, Table, Spin, Empty, Badge, Tag, Avatar, Radio, Popconfirm} from 'antd';
import {Button} from "antd";

import StudentDrawerForm from './StudentDrawerForm';
import {errorNotification, successNotification} from "./Notification";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const TheAvatar = ({name}) => {
    if (name.trim().length === 0) {
        return <Avatar icon={<UserOutlined/>} />
    }
    const split = name.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>
             {`${name.charAt(0)}${name.charAt(name.length - 1)}`}
           </Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification( "Student deleted", `Student with ${studentId} was deleted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    });
}
const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  }; // as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App()  {
   const [students, setStudents] = useState([]);

   const [collapsed, setCollapsed] = useState(false);

   const [fetching, setFetching] = useState(true);

    const [showDrawer, setShowDrawer] = useState(false);



    const {
       token: { colorBgContainer },
     } = theme.useToken();

   const fetchStudents = () =>
     getAllStudents()
        .then(resp => resp.json())
        .then(data => {
          console.log(data);
          setStudents(data);
          setFetching(false);
        }).catch(err => {
            console.log("err.response : ", err.response);
            err.response.json().then(res => {
                console.log("res : ", res);
                errorNotification("There was an issue", `${res.message} [status: ${res.status}] [error: ${res.error}]`)
            })
           }).finally(() => setFetching(false));

   useEffect (() => {
      console.log("Component mounted");
         fetchStudents().then();
   }, []);


   const renderSpin = () => {
       if (fetching) {
          return <Spin indicator={antIcon} />;
       }
   }

      const renderStudent = () => {

          if (students.length <= 0) {
              return <>
                  <Button
                      onClick={() => setShowDrawer(!showDrawer)}
                      type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                      Add New Student
                  </Button>
                  <StudentDrawerForm
                      showDrawer={showDrawer}
                      setShowDrawer={setShowDrawer}
                      fetchStudents={fetchStudents}
                  />
                  <Empty/>
              </>
          }



         return (
          <>
              <StudentDrawerForm
                  showDrawer={showDrawer}
                  setShowDrawer={setShowDrawer}
                  fetchStudents={fetchStudents}
              />

              <Table dataSource={students}
                  columns={columns(fetchStudents)}
                  bordered
                  title={()=>
                      <>
                          <Tag style={{marginLeft: "5px"}}>Number of students</Tag>
                          <Badge count={students.length} color="#faad14" />
                          <br />
                          <br />
                          <Button
                              onClick={() => setShowDrawer(!showDrawer)}
                              type="primary" icon={<PlusOutlined />} size="small">
                              Add New Student
                          </Button>
                      </>
                 }
                  pagination={{ pageSize: 50 }} scroll={{ y: 500 }}
                  rowKey={(student) => student.id}
              />;
          </>
         )
      }


       return <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
                    </Sider>
                    <Layout className="site-layout">
                      <Header style={{ padding: 0, background: colorBgContainer }} />
                      <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                          <Breadcrumb.Item>User Change</Breadcrumb.Item>
                          <Breadcrumb.Item>Bill Change</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                          Alex is Java programmer.{renderSpin()}
                          {renderStudent()}
                        </div>
                      </Content>
                      <Footer style={{ textAlign: 'center' }}>By Alex</Footer>
                    </Layout>
                  </Layout>


}

export default App;
