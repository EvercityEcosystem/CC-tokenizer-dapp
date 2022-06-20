import {useCallback, useContext, useEffect, useMemo} from "react";
import {store} from "../components/PolkadotProvider";
import {connect, getInjector} from "../utils/polkadot";
import {getAvailableRoles} from "../utils/roles";
import {notification} from "antd";
import {fromEverUSD, toEverUSD} from "../utils/converters";
import {transactionCallback} from "../utils/notify";
import {getCurrentUser} from "../utils/storage";
import {useNavigate} from "react-router-dom";

const usePolkadot = () => {
  const { polkadotState, dispatch } = useContext(store);
  const navigate = useNavigate();
  const { api, injector } = polkadotState;

  const isAPIReady = useMemo(
    () => polkadotState?.api?.isConnected && polkadotState?.api?.isReady,
    [polkadotState],
  );

  useEffect(() => {
    if (isAPIReady) {
      setTimeStep();
    }
  }, [isAPIReady])

  const dayDuration = useCallback(async () => {
    const result = await api.consts.evercity.timeStep;
    return result?.toJSON();
  }, [api]);

  const connectAPI = async () => {
    const api = await connect();
    api.on("error", error => {
      console.error("API error: ", error);
    });

    dispatch({
      type: "setAPI",
      payload: api,
    });
  };

  const setTimeStep = async () => {
    const timeStep = await dayDuration();
    console.log("time")
    dispatch({
      type: "setTimeStep",
      payload: timeStep,
    });
  };

  const setInjector = async () => {
    const injector = await getInjector();
    dispatch({
      type: "setInjector",
      payload: injector,
    });
  };

  const initAPI = useCallback(() => {
    connectAPI();
    setInjector();
  }, [setTimeStep, connectAPI, setInjector, dispatch]);

  const accountRegistry = useCallback(
    async address => {
      const data = await api.query.evercityAccounts.accountRegistry(address);
      const { roles: roleMask, identity } = data.toJSON();
      const roles = getAvailableRoles(roleMask);

      return { roles, identity };
    },
    [api],
  );

  const requestMintTokens = useCallback(
    async values => {
      const { address } = getCurrentUser();
      const { amount } = values;

      if (amount <= 0) {
        return;
      }

      try {
        await api.tx.evercity
          .tokenMintRequestCreateEverusd(BigInt(toEverUSD(amount)))
          .signAndSend(
            address,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Mint request"),
          );

        notification.success({
          message: "Mint request",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const revokeMintTokens = useCallback(async () => {
    const { address } = getCurrentUser();

    try {
      await api.tx.evercity.tokenMintRequestRevokeEverusd().signAndSend(
        address,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback("Mint revoke"),
      );

      notification.success({
        message: "Mint revoke",
        description: "Transaction has been sent to blockchain",
      });
    } catch (error) {
      notification.error({
        message: "Signing/sending transaction process failed",
        description: `${error}`,
      });
    }
  }, [api, injector, transactionCallback]);

  const requestBurnTokens = useCallback(
    async values => {
      const { amount } = values;
      const { address } = getCurrentUser();

      if (amount <= 0) {
        return;
      }

      try {
        await api.tx.evercity
          .tokenBurnRequestCreateEverusd(BigInt(toEverUSD(amount)))
          .signAndSend(
            address,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Burn request"),
          );

        notification.success({
          message: "Burn request",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const revokeBurnTokens = useCallback(async () => {
    const { address } = getCurrentUser();

    try {
      await api.tx.evercity.tokenBurnRequestRevokeEverusd().signAndSend(
        address,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback("Burn revoke"),
      );

      notification.success({
        message: "Burn revoke",
        description: "Transaction has been sent to blockchain",
      });
    } catch (error) {
      notification.error({
        message: "Signing/sending transaction process failed",
        description: `${error}`,
      });
    }
  }, [api, injector, transactionCallback]);

  const checkMintRequest = useCallback(
    async address => {
      const result = await api.query.evercity.mintRequestEverUSD(address);

      const { amount, deadline } = result?.toJSON() || {};
      return {
        amount: fromEverUSD(amount),
        deadline,
      };
    },
    [api],
  );

  const checkBurnRequest = useCallback(
    async address => {
      const result = await api.query.evercity.burnRequestEverUSD(address);

      const { amount, deadline } = result?.toJSON() || {};
      return {
        amount: fromEverUSD(amount),
        deadline,
      };
    },
    [api],
  );


  const totalSupplyEverUSD = useCallback(async () => {
    const data = await api.query.evercity.totalSupplyEverUSD();

    return fromEverUSD(data?.toNumber());
  }, [api]);

  const confirmEverusdRequest = useCallback(
    async (action, amount, investorAddress) => {
      const command =
        action.toLowerCase() === "mint"
          ? "tokenMintRequestConfirmEverusd"
          : "tokenBurnRequestConfirmEverusd";
      const { address } = getCurrentUser();

      try {
        await api.tx.evercity[command](
          investorAddress,
          BigInt(toEverUSD(amount)),
        ).signAndSend(
          address,
          {
            signer: injector.signer,
          },
          transactionCallback(`${action} confirm`),
        );

        notification.success({
          message: `${action} confirm`,
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const declineEverusdRequest = useCallback(
    async (action, investorAddress) => {
      const command =
        action.toLowerCase() === "mint"
          ? "tokenMintRequestDeclineEverusd"
          : "tokenBurnRequestDeclineEverusd";
      const { address } = getCurrentUser();

      try {
        await api.tx.evercity[command](investorAddress).signAndSend(
          address,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback(`${action} decline`),
        );

        notification.success({
          message: `${action} decline`,
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const fetchBalance = useCallback(async () => {
    const { address } = getCurrentUser();

    if (!api || !address) {
      return 0;
    }

    const data = await api.query.evercity.balanceEverUSD(address);

    const balance = parseInt(data?.toBigInt());

    return fromEverUSD(balance);
  }, [api]);

  const requestNewAsset = useCallback(
    async () => {
      const name = "new_asset";
      notification.success({
        message: `Asset ${name} was created`,
        description: <div>Please, go to <a target="__blank" href='https://www.ecoregistry.io/projects'>registry</a> for repay.</div>
      });
      navigate(`${name}`);
  }, [navigate]);

  return { dayDuration, initAPI, isAPIReady, accountRegistry,  requestMintTokens,
    revokeMintTokens,
    requestBurnTokens,
    revokeBurnTokens,
    checkMintRequest, checkBurnRequest,
    totalSupplyEverUSD,
    confirmEverusdRequest, declineEverusdRequest,
    fetchBalance,
    requestNewAsset
  };
};

export default usePolkadot;
