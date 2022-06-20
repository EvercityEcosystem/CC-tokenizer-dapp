import React from "react";
import Container from "../../ui/Container/Container";
import {Button, Form} from "antd";
import useEcoRegistry from "../../hooks/useEcoRegistry";
import InputNumber from "../../ui/InputNumber/InputNumber";

const CustodianProjects = () => {
  const { fetchProject } = useEcoRegistry();
  const handleRequest = ({projectId}) => {
    fetchProject(projectId);
  };

  return(<Container>
    <Form onFinish={handleRequest}>
      <Form.Item name="projectId" label="Project ID:">
        <InputNumber />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" block>
          Request project
        </Button>
      </Form.Item>
    </Form>
  </Container>);
};

export default CustodianProjects;
