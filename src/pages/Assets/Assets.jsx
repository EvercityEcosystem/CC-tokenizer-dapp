import React, { useContext, useEffect, useMemo } from "react";
import Container from "../../ui/Container/Container";
import { Alert, Button, Form, Modal, Typography } from "antd";
import usePolkadot from "../../hooks/usePolkadot";
import styles from "./Assets.module.less";
import { store } from "../../components/PolkadotProvider";
import TableAssets from "../../components/TableAssets/TableAssets";
import { getCurrentUser } from "../../utils/storage";
import ExternalLink from "../../ui/Link/ExternalLink";
import FormMintAsset from "../../components/FormMintAsset/FormMintAsset";
import FormBurnAsset from "../../components/FormBurnAsset/FormBurmAsset";
import { FireOutlined } from "@ant-design/icons";

const Assets = () => {
  const {
    createNewAsset,
    loading,
    fetchAssets,
    isAPIReady,
    mintAsset,
    burnAsset,
    selfBurnAsset,
    isCustodian,
  } = usePolkadot();

  const { polkadotState } = useContext(store);
  const { address } = getCurrentUser();
  const [modal, contextHolder] = Modal.useModal();
  const [formBurn] = Form.useForm();
  const [formMint] = Form.useForm();

  useEffect(() => {
    if (isAPIReady) {
      fetchAssets();
    }
  }, [isAPIReady]);

  const assets = useMemo(() => {
    if (isCustodian) {
      return polkadotState?.assets || [];
    }
    return (
      polkadotState?.assets?.filter(
        asset =>
          asset.list_accounts.includes(address) || asset.owner === address,
      ) || []
    );
  }, [address, polkadotState, isCustodian]);
  const handleRequest = async () => {
    await createNewAsset();
  };

  const handleMint = assetId => {
    modal.confirm({
      onOk: close => {
        formMint.validateFields().then(() => {
          close();
          formMint.submit();
        });
      },
      title: `Mint asset with ID ${assetId}`,
      onCancel: () => formMint.resetFields(),
      content: (
        <FormMintAsset
          form={formMint}
          onFinish={() => {
            const amount = formMint.getFieldValue("amount");
            mintAsset({ id: assetId, amount });
          }}
        />
      ),
    });
  };
  const handleBurn = (assetId, accounts) => {
    modal.confirm({
      title: `Burn asset with ID ${assetId}`,
      icon: <FireOutlined form={formBurn} />,
      onOk: close => {
        formBurn.validateFields().then(() => {
          close();
          formBurn.submit();
        });
      },
      onCancel: () => formBurn.resetFields(),
      content: (
        <FormBurnAsset
          form={formBurn}
          accounts={accounts}
          isCustodian={isCustodian}
          onFinish={() => {
            const amount = formBurn.getFieldValue("amount");
            if (isCustodian) {
              const account = formBurn.getFieldValue("account");
              burnAsset({ id: assetId, account, amount });
            }
            if (!isCustodian) {
              selfBurnAsset({ id: assetId, amount });
            }
          }}
        />
      ),
    });
  };

  return (
    <Container justify="start">
      <Typography.Title level={2}>Carbon Assets</Typography.Title>
      {loading && (
        <Alert
          className={styles.alert}
          showIcon
          message="Go to the external registry and buys and retires/transfers the asset"
          closable
          type="warning"
          action={
            <ExternalLink href="https://www.ecoregistry.io/projects">
              Registry
            </ExternalLink>
          }
        />
      )}
      <TableAssets
        assets={assets}
        onMint={handleMint}
        onBurn={handleBurn}
        isCustodian={isCustodian}
      />
      {contextHolder}
      <div className={styles.newBtn}>
        <Button type="primary" onClick={handleRequest} loading={loading}>
          New asset
        </Button>
      </div>
    </Container>
  );
};

export default Assets;
