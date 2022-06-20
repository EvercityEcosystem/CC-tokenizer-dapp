import React from "react";
import Container from "../../ui/Container/Container";
import {Button, Form, Input, Spin} from "antd";
import {useParams} from "react-router-dom";
import InputNumber from "../../ui/InputNumber/InputNumber";
import useEcoRegistry from "../../hooks/useEcoRegistry";

const Asset = () => {
  const { name } = useParams();
  const { pinProjectToIPFS, loading, url } = useEcoRegistry();

  const handlePrepay = async ({projectId, serialNumber, repaidCount }) => {
    await pinProjectToIPFS({
      projectId,
      asset_name: name,
      serial_number: serialNumber,
      repaid_count: repaidCount
    });
  }
  return <Container>
    <Form
      onFinish={handlePrepay}
      disabled={loading}
      labelAlign="left"
      labelCol={{ span: 10 }}
      wrapperCol={ {span: 14} }
    >
      <Form.Item label="Serial number" name="serialNumber" required rules={[
        {
          required: true
        }
      ]}>
        <Input />
      </Form.Item>
      <Form.Item label="Project ID" name="projectId" required rules={[
        {
          required: true
        }
      ]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="Count" name="repaidCount" required rules={[
        {
          required: true
        }
      ]}>
        <InputNumber />
      </Form.Item>
      <Form.Item wrapperCol={ {span: 24} }>
        <Button htmlType="submit" block type="primary">
          Prepay
        </Button>
      </Form.Item>
    </Form>
    <Spin spinning={loading} />
    {url && <a target="__blank" href={url}>Go to file</a>}
  </Container>
};

export default Asset;
