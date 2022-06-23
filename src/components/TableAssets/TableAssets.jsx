import React from "react";
import { Table } from "antd";
import ExternalLink from "../../ui/Link/ExternalLink";
import Button from "../../ui/Button/Button";
import styles from "./TableAssets.module.less";
import Actions from "../../ui/Actions/Actions";

const TableAssets = ({ assets, onMint, onBurn, isCustodian }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Supply",
      dataIndex: "supply",
    },
    {
      title: "Actions",
      dataIndex: "url",
      width: 300,
      render: (url, asset) => (
        <Actions>
          <ExternalLink view="action" href={url}>
            View
          </ExternalLink>
          {isCustodian && (
            <Button view="action" onClick={() => onMint(asset.id)}>
              Mint
            </Button>
          )}
          <Button
            view="action"
            onClick={() => onBurn(asset.id, asset.list_accounts)}
            disabled={Number(asset.supply) === 0}>
            Burn
          </Button>
        </Actions>
      ),
    },
  ];

  if (!isCustodian) {
    columns.splice(
      1,
      0,
      {
        title: "Balance",
        dataIndex: "balance",
      },
      {
        title: "Certificates",
        dataIndex: "certificates",
      },
    );
  }
  return (
    <Table
      size="small"
      className={styles.table}
      dataSource={assets}
      columns={columns}
    />
  );
};

export default TableAssets;
