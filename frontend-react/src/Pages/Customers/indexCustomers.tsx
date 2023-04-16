import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Space, Table, } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import axios from 'axios'
import React from 'react'
import { text } from 'stream/consumers';

type Props = {};

const API_URL = 'http://localhost:9000/customers';
export default function Customers({ }: Props) {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);
  const [createFrom] = Form.useForm();
  const [updateFrom] = Form.useForm();
const columns: ColumnsType<any> = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    width: '1%',
    align: 'right'

  },
  {
    title: 'FirstName',
    dataIndex: 'firstName',
    key: 'firstname',
    render: (text, record, index) => {
      return <strong style={{ color: '#fab1a0' }}>{text}</strong>
    }
  },
  {
    title: 'LastName',
    dataIndex: 'lastName',
    key: 'lastname',
    render: (text, record, index) => {
      return <strong style={{ color: '#fab1a0' }}>{text}</strong>
    }
  },
  {
    title: 'PhoneNumber',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',

  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',

  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',

  },
  {
    title: 'Birthday',
    dataIndex: 'birthday',
    key: 'birthday',

  },

  {
    title: '',
    dataIndex: 'actions',
    key: 'actions',
    width: '1%',
    render: (text, record, index) => {
      return (
     <Space>
      <Button icon={<EditOutlined/>}  onClick={() =>{
          setOpen(true);
          setUpdateId(record.id)
          updateFrom.setFieldsValue(record);

      }}
        />

      <Button danger icon={<DeleteOutlined />} onClick={() => {
        console.log(record.id);
        axios.delete(API_URL + '/' + record.id).then((response) =>{
            setRefresh((f) => f + 1)
         
          message.success('Xoa danh mục thành công', 1.5) 
        })


      }} 
      />
      </Space>
      );
    }

  },

];



  React.useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        const { data } = response;
        setCustomers(data);
        console.log(data);

      }).catch(err => {
        console.error(err);

      })
      ;
  }, [refresh]);

  const onFinish = (values: any) => {
    console.log(values);
    axios
      .post(API_URL, values)
      .then((response) => {
        setRefresh((f) => f + 1)
        createFrom.resetFields();
        message.success('Thêm mới danh mục thành công', 1.5)

      }).catch((err) => { });
  };
  const onUpdateFinish = (values: any) => {
    // console.log(values);

    axios
      .patch(API_URL + '/' + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1)
       updateFrom.resetFields();
        message.success('Cap nhat danh mục thành công', 1.5);
        setOpen(false)
      }).catch((err) => { });
  };
    
  

  return (
    <div style={{ padding: 25 }}>

      <div style={{}}>
        <Form
          form={createFrom}
          name='create-form'
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}>

          <Form.Item
            label="FirstName"
            name="FirstName"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="LastName"
            name="LastName"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phonenumber"
            name="PhoneNumber"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="Address"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="Email"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="Birthday"
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu Thông Tin
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table rowKey='id' dataSource={customers} columns={columns} pagination={false} />

      <Modal open={open} title='Cap nhat danh muc' 
      onCancel={() => {
       setOpen(false);
      }}
      cancelText='Dong'
      okText='Luu thong tin'
      onOk={() =>{
       updateFrom.submit();
      }}
      
      >
       
      <Form
          form={updateFrom}
          name='update-form'
          onFinish={onUpdateFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}>

          <Form.Item
            label="FirstName"
            name="FirstName"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="LastName"
            name="LastName"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
           label="Phonenumber"
           name="PhoneNumber"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="Address"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="Email"
            hasFeedback
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="Birthday"
            rules={[{ required: true, message: 'Vui lòng nhập đầy đủ thông tin!' }]}
          >
            <Input />
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  )
}