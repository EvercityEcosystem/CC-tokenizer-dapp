import React from "react";
import Container from "../../ui/Container/Container";
import {Button, Form, PageHeader} from "antd";
import usePolkadot from "../../hooks/usePolkadot";

const Assets = () => {
  const { requestNewAsset } = usePolkadot();
  const handleRequest = () => {
    requestNewAsset();
  };

  return(<Container>
    <PageHeader
      title="Create assets"
    />
    <Button type="primary" onClick={handleRequest}>New asset</Button>
  </Container>);
};

export default Assets;
