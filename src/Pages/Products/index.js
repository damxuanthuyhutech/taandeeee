import React, { useEffect, useState, useMemo } from "react";
import { Table, Modal, Form, Input, InputNumber, Button } from "antd";
import productsService from "../../Services/productsService";
import generateCollumns from "./columnsProducts";
const Products = () => {
  const [formModal] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dataProducts, setDataProducts] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loaddataProducts();
  }, []);

  const loaddataProducts = () => {
    productsService.getListProducts().then((res) => {
      console.log(res);
      setDataProducts(res);
    });
  };

  const editStudent = (id) => {
    productsService.get(id).then((res) => {
      console.log(res);
      formModal.setFieldsValue({
        id: res.id,
        age: res.age,
        name: res.name,
        numberPhone: res.numberPhone,
        email: res.email,
      });
    });
    setVisible(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id) => {
    productsService.delete(id).then((res) => {
      console.log(res);
      loaddataProducts();
    });
  };

  const createPeople = () => {
    formModal.resetFields();
    formModal.setFieldsValue({
      id: dataProducts.length + 5,
    });
    setVisible(true);
  };

  const studentsColumns = useMemo(
    () =>
      generateCollumns({
        edit: editStudent,
        delteSt: handleDelete,
      }),
    [editStudent, handleDelete]
  );

  const onFinish = (values) => {
    const index = dataProducts.findIndex((item) => item.id === values.id);
    // const data = {
    //   name: values.name,
    //   age: values.age,
    // };
    console.log(values);
    if (index > -1) {
      productsService.update(values.id, values).then((res) => {
        console.log(res);
        loaddataProducts();
      });
    } else {
      productsService.add(values).then((res) => {
        console.log(res);
        loaddataProducts();
      });
    }
    handleCancel();
  };

  const handleCancel = () => {
    formModal.resetFields();
    setVisible(false);
  };
  return (
    <div className="container">
      <div className="row">
        <Button
          type="primary"
          onClick={createPeople}
          danger
          style={{ marginLeft: "auto" }}
        >
          Create
        </Button>
      </div>
      <div className="row">
        <Table columns={studentsColumns} dataSource={dataProducts} />
      </div>
      <Modal
        title="Edit Student"
        visible={visible}
        onCancel={handleCancel}
        footer={
          <Button type="primary" htmlType="submit" form="formModal">
            Save
          </Button>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          form={formModal}
          name="formModal"
          onFinish={onFinish}
        >
          <Form.Item name="id" label="Id" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="numberPhone"
            label="Phone"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
