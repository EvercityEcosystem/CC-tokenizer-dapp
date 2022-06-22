import {useCallback, useContext, useMemo, useState} from "react";
import {store} from "../components/PolkadotProvider";
import {connect, getInjector} from "../utils/polkadot";
import {notification} from "antd";
import {transactionCallback} from "../utils/notify";
import {getCurrentUser} from "../utils/storage";
import {useNavigate} from "react-router-dom";
import {blake2AsHex} from "@polkadot/util-crypto";

const usePolkadot = () => {
  const { polkadotState, dispatch } = useContext(store);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { api, injector } = polkadotState;

  const toggleLoading = useCallback(() => {
    setLoading((prev) => !prev)
  }, [setLoading]);

  const isAPIReady = useMemo(
    () => !!polkadotState?.api?.isConnected && !!polkadotState?.api?.isReady,
    [polkadotState],
  );
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
  }, [connectAPI, setInjector, dispatch]);

  const createNewAsset = useCallback(
    async () => {
      const { address } = getCurrentUser();
      toggleLoading();
      try {
        await api.tx.carbonAssets.create().signAndSend(
          address,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback(`Create new asset`, (block) => {
            block.events.forEach(({ event: { data, method, section } }) => {
              if(
                section === "carbonAssets" &&
                method === "Created" &&
                String(data.creator.toHuman()) === String(address)
              ) {
                toggleLoading();
                navigate(`${data.assetId.toNumber()}`);
              }
            });
          }),
        );
      } catch (e) {
        toggleLoading();
        console.log(e)
      }

  }, [api, navigate, toggleLoading]);

  const fetchMetadataAsset = useCallback( (id) =>  api.query.carbonAssets.metadata(id).then((metadata) => metadata.toHuman()), [api]);

  const setProjectData = useCallback(async ({assetId, url, project }) => {
    const projectHash = blake2AsHex(JSON.stringify(project));
    try {
      await api.tx.carbonAssets.setProjectData(assetId, url, projectHash).signAndSend({
        signer: injector.signer,
        nonce: -1,
      });
    } catch (e) {
      console.log(e)
    }
  }, [api]);



  return {
    initAPI,
    isAPIReady,
    loading,
    createNewAsset,
    fetchMetadataAsset,
    setProjectData,
  };
};

export default usePolkadot;
