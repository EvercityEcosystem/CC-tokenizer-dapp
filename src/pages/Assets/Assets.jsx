import React from "react";
import Container from "../../ui/Container/Container";
import {Alert, Button, Typography} from "antd";
import usePolkadot from "../../hooks/usePolkadot";
import styles from "./Assets.module.less";

const Assets = () => {
  const { createNewAsset, loading } = usePolkadot();
  const handleRequest = async () => {
    await createNewAsset();
  };
  return(<Container>
    <Typography.Title level={2}>Create Asset</Typography.Title>
    {loading && <Alert
      className={styles.alert}
      showIcon
      message="Go to the external registry and buys and retires/transfers the asset"
      closable
      type="warning"
      action={<Typography.Link target="__blank" href='https://www.ecoregistry.io/projects'>Registry</Typography.Link>}
    />}
    <Button type="primary" onClick={handleRequest} loading={loading}>New asset</Button>
  </Container>);
};

export default Assets;
