import { Button, Drawer, Form, Input, InputNumber, message, Modal, Pagination, Select, Space, Table } from 'antd';
import axios from '../../libraries/axiosClient';
import React, { useCallback } from 'react';

import { ClearOutlined, DeleteOutlined, EditOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import numeral from 'numeral';

const apiName = '/products';

export default function Categories() {
  const [items, setItems] = React.useState<any[]>([]); // data trong table
  const [categories, setCategories] = React.useState<any[]>([]);
  const [suppliers, setSupplier] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);
  const [showTable, setShowTable] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const [skip, setSkip] = React.useState<number>(0);
  const [nameSearch, setNameSearch] = React.useState<string>('');
  const [categorySearch, setCategorySearch] = React.useState<string>('');
  const [supplierSearch, setSuplierSearch] = React.useState<string>('');

  const [dataSearch, setDataSearch] = React.useState<{}>({});

  
  const [category, setCategory] = React.useState<any[]>();
  // const [sup, setSup] = React.useState<any[]>();

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [handleSearch] = Form.useForm();
  const showDrawer = () => {
    setOpenFilter(true);
  };

  const onClose = () => {
    setOpenFilter(false);
  };
  // const onSelectCategoryFilter = useCallback((e: any) => {
  //   setCategory(e.target.value);
  // }, []);

  // const callApi = useCallback((searchParams: any) => {
  //   axios
  //   .get(`${apiName}${`?${searchParams.toString()}`}`)
  //   .then((response) => {
  //     const { data } = response;
  //     setItems(data);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
  // }, []);

  const onClearSearch = () => {
      setNameSearch('');
      setSuplierSearch('');
      setCategorySearch('');
      setDataSearch({});
  }
  const onSearch = () => {
    if (nameSearch === '' && categorySearch === '' && supplierSearch === '') {
      return;
    }
    setDataSearch({
      productName: nameSearch,
      category: categorySearch,
      supplier : supplierSearch
    });
    console.log(dataSearch);
    
    setTotal(items.length)
    // setNameSearch(name);
    // let filters: { category: any} = {
    //   category,
    // };
    
    // const searchParams: URLSearchParams = new URLSearchParams(filters);

    // callApi(searchParams);
  } ;

  const columns: ColumnsType<any> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: '1%',
      align: 'right',
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => {
        return <strong>{record?.category?.name}</strong>;
      },
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier.name',
      key: 'supplier.name',
      render: (text, record, index) => {
        return <span>{record?.supplier?.name}</span>;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (text, record, index) => {
        return <span>{numeral(text).format('0,0')}</span>;
      },
    },
    {
      title: 'Giảm',
      dataIndex: 'discount',
      key: 'discount',
      width: '1%',
      align: 'right',
      render: (text, record, index) => {
        return <span>{numeral(text).format('0,0')}%</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: 'nowrap' }}>Tồn kho</div>;
      },
      dataIndex: 'stock',
      key: 'stock',
      width: '1%',
      align: 'right',
      render: (text, record, index) => {
        return <span>{numeral(text).format('0,0')}</span>;
      },
    },
    {
      title: 'Mô tả / Ghi chú',
      dataIndex: 'description',
      key: 'description',
    },

    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      width: '1%',
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record.id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                axios.delete(apiName + '/' + record.id).then((response) => {
                  setRefresh((f) => f + 1);
                  message.success('Xóa danh mục thành công!', 1.5);
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  // Get products
  // trang thứ 1 : 0 -> 9 => 
  // trang thứ 2
  // ,{
  //   params: {
  //     skip: 10, 
  //     limit: 10,
  //   },
  // }
  React.useEffect(() => {
    
    axios
      .get(apiName,{
          params: {
            skip: skip, 
            limit: 10,
            ...dataSearch

          },
        })
      .then((response) => {
        const result = response.data;
        
        setItems(result.data);
        setTotal(result.total);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh,showTable,skip,dataSearch]);

  // Get categories
  React.useEffect(() => {
    axios
      .get('/categories')
      .then((response) => {
        const { data } = response;
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Get suppliers
  React.useEffect(() => {
    axios
      .get('/suppliers')
      .then((response) => {
        const { data } = response;
        setSupplier(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onFinish = (values: any) => {
    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success('Thêm mới danh mục thành công!', 1.5);
        setShowTable(true);
        
      })
      .catch((err) => {});
  };
  const handlePageChange = (page: number) => {
      setSkip((page - 1) * 10);
  };
  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + '/' + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success('Cập nhật thành công!', 1.5);
        setOpen(false);
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{}}>
        {/* CREAT FORM */}
        {
          showTable === false ?
          <>
             <Form
          form={createForm}
          name='create-form'
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label='Danh mục sản phẩm'
            name='categoryId'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Danh mục sản phẩm bắt buộc phải chọn',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>

          <Form.Item
            label='Nhà cung cấp'
            name='supplierId'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Nhà cung cấp bắt buộc phải chọn',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>
          <Form.Item
            label='Tên sản phẩm'
            name='name'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Tên sản phẩm bắt buộc phải nhập',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Giá bán'
            name='price'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Giá bán bắt buộc phải nhập',
              },
            ]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label='Giảm giá' name='discount' hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label='Tồn kho' name='stock' hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type='primary' htmlType='submit'>
              Lưu thông tin
            </Button>
          </Form.Item>
            </Form>
          </>
          :
          <>
            {/* <div style={{ background: 'red'}}>
        <select id="cars" onChange={onSelectCategoryFilter}>
        {
          categories.map((item: { _id: string, name: string }) => {
            return <option key={item._id} value={item._id}>{item.name}</option>;
          })
        }

        </select>

        <button onClick={onSearch}>Search</button>
      </div> */}
      <Button type="dashed" onClick={showDrawer} style={{marginBottom: '5px'}} icon={<FilterOutlined />}>
        Filter
      </Button>
      <Drawer title="Filter Product" placement="right"   width={500} onClose={onClose} open={openFilter}>
        {/* search name product */}
        <Form
         form={handleSearch}
         name='search-form'
         onFinish={onFinish}
         labelCol={{
           span: 8,
         }}
         wrapperCol={{
           span: 16,
         }}
         
        >
        <Form.Item
            label='Tên sản phẩm'
            name='name'
            hasFeedback={nameSearch === '' ? false : true}
            valuePropName={nameSearch}
          >
            <Input value={nameSearch} onChange={(e)=>{
              setNameSearch(e.target.value)
             }} />
          </Form.Item>
          <Form.Item
            label='Danh mục sản phẩm'
            name='categori'
            hasFeedback={categorySearch === '' ? false : true}
            valuePropName={categorySearch}
          >
          <Select
               onChange={(value)=>{
                setCategorySearch(value);
              }}
              value={categorySearch}
              style={{ width: '100%' }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
             </Form.Item>
        <Form.Item
            label='Nhà cung cấp'
            name='supplier'
            hasFeedback={supplierSearch === '' ? false : true}
            valuePropName={supplierSearch}
          >
          <Select
              style={{ width: '100%' }}
              onChange={(value)=>{
                setSuplierSearch(value);
              }}
              value={supplierSearch}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
             </Form.Item>
       
              <Form.Item
              wrapperCol={{ offset: 8, span: 16 }}
              >
            <Button 
            onClick={onClearSearch}
            style={{marginRight: '5px'}}
            >
              Clear
              <ClearOutlined /> 
              </Button>
            <Button onClick={onSearch} >
              Search
              <SearchOutlined /> 
            </Button>
        </Form.Item>
        
        
        </Form>
      </Drawer>
      <Table rowKey='id' dataSource={items} columns={columns} pagination={false} />
      <Pagination
        // current={currentPage}
        // pageSize={pageSize}
        total={total}
        onChange={handlePageChange} // Gọi hàm xử lý khi người dùng thay đổi trang
      />

      {/* EDIT FORM */}

      <Modal
        open={open}
        title='Cập nhật danh mục'
        onCancel={() => {
          setOpen(false);
        }}
        cancelText='Đóng'
        okText='Lưu thông tin'
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name='update-form'
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label='Danh mục sản phẩm'
            name='categoryId'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Danh mục sản phẩm bắt buộc phải chọn',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>

          <Form.Item
            label='Nhà cung cấp'
            name='supplierId'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Nhà cung cấp bắt buộc phải chọn',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>
          <Form.Item
            label='Tên sản phẩm'
            name='name'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Tên sản phẩm bắt buộc phải nhập',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Giá bán'
            name='price'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Giá bán bắt buộc phải nhập',
              },
            ]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label='Giảm giá' name='discount' hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label='Tồn kho' name='stock' hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        </Form>
      </Modal>
          </>
        }
       
      </div>
      {/* TABLE */}

      
    </div>
  );
}