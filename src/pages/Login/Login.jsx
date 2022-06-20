import React, {useEffect, useCallback, useContext, useState, useReducer} from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { web3Accounts } from "@polkadot/extension-dapp";

import { saveCurrentUser } from "../../utils/storage";

import usePolkadot from "../../hooks/usePolkadot";
import Loader from "../../ui/Loader/Loader";
import {store} from "../../components/PolkadotProvider";
import SelectAccountForm from "../../components/SelectAccountForm/SelectAccountForm";
import RequestInstall from "../../components/RequestInstall/RequestInstall";
import Container from "../../ui/Container/Container";

const initialState = {
  accounts: [],
  currentAccount: null,
  roles: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setAccounts':
      return { ...state, accounts: action.payload }
    case 'setCurrentAccount':
      return { ...state, currentAccount: action.payload }
    case 'setRoles':
      return { ...state, roles: action.payload }
    default:
      return state;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const { accountRegistry } = usePolkadot();
  const { polkadotState } = useContext(store);
  const [loginState, dispatch] = useReducer(reducer, initialState);

  const checkExtension = useCallback(async () => {
    const allAccounts = await web3Accounts();
    if (allAccounts.length) {
      dispatch({
        type: "setAccounts",
        payload: allAccounts
      })
    }
  }, []);

  const handleAccountSubmit = async values => {
    const { address } = values;
    const { roles } = await accountRegistry(address);

    if (roles.length === 1) {
      saveCurrentUser({address, role: roles[0]});
      navigate("/dapp/profile");
      return null;
    }

  };

  const handleRoleSubmit = async values => {
    const { role } = values;
    const { address } = accountsState;

    saveCurrentUser(address, role);
    navigate("/dapp/profile");
  };

  useEffect(() => {
    if (polkadotState.injector) {
      checkExtension();
    }
  }, [checkExtension, polkadotState]);


  const injectorDetection = typeof polkadotState.injector === "undefined";


  let content = <RequestInstall />;

  if (polkadotState.injector) {
    content = <SelectAccountForm accounts={loginState.accounts} onSelectAccount={handleAccountSubmit} />
  }

  return (
      <Container>
        {content}
      </Container>
  );
};


export default Login;
