/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from "react";

import SimpleForm from "../../ui/SimpleForm/SimpleForm";

import usePolkadot from "../../hooks/usePolkadot";

import { useParams } from "react-router-dom";
import Container from "../../ui/Container/Container";

const CustodianTokens = () => {
  const params = useParams();
  const { actionType = "confirm" } = params;
  const { confirmEverusdRequest, declineEverusdRequest } = usePolkadot();

  const confirmFormConfig = {
    action: {
      label: "Action",
      required: true,
      display: "select",
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { "Confirm Mint EverUSD": "Mint" },
        { "Confirm Burn EverUSD": "Burn" },
      ],
    },
    address: {
      label: "Address",
      required: true,
      type: "string",
      span: 24,
    },
    amount: {
      label: "Amount",
      required: true,
      type: "number",
      span: 24,
    },
  };

  const declineFormConfig = {
    action: {
      label: "Action",
      required: true,
      display: "select",
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { "Decline Mint EverUSD": "Mint" },
        { "Decline Burn EverUSD": "Burn" },
      ],
    },
    address: {
      label: "Address",
      required: true,
      type: "string",
      span: 24,
    },
  };

  const handleSubmit = async values => {
    const { action, amount, address } = values;

    if (actionType === "confirm") {
      confirmEverusdRequest(action, amount, address);
    } else {
      declineEverusdRequest(action, address);
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Container>
      <SimpleForm
        config={
          actionType === "confirm" ? confirmFormConfig : declineFormConfig
        }
        onSubmit={handleSubmit}
        submitText="Submit"
        labelAlign="left"
        initialValues={{ action: null, address: null, amount: null }}
        {...layout}
      />
    </Container>
  );
};


export default CustodianTokens;
