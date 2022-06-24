import React from "react";
import { Table } from "antd";
import ExternalLink from "../../ui/Link/ExternalLink";
import Button from "../../ui/Button/Button";
import styles from "./TableAssets.module.less";
import Actions from "../../ui/Actions/Actions";
import classnames from "classnames";

const TableAssets = ({
  assets,
  onMint,
  onBurn,
  isCustodian,
  className,
  onTransfer,
}) => {
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
          {!isCustodian && (
            <Button
              view="action"
              onClick={() => onTransfer(asset.id)}
              disabled={Number(asset.balance) === 0}>
              Transfer
            </Button>
          )}
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
      className={classnames(styles.table, className)}
      dataSource={assets}
      columns={columns}
    />
  );
};

export default TableAssets;
