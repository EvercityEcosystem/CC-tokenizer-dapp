import {useCallback, useReducer} from "react";
import {notification} from "antd";

const ECOREGISTRY_API = "https://api-front.ecoregistry.io/api";
const PINATA_URI = "https://api.pinata.cloud";

const initialState = {
  loading: false,
  url: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return {...state, loading: action.payload };
    case "setUrl":
      return {...state, url: action.payload };
    default:
      return initialState
  }
};

const useEcoRegistry = () => {
  const [{ loading, url }, dispatch] = useReducer(reducer, initialState);

  const fetchProject = useCallback((id) =>
    fetch(`${ECOREGISTRY_API}/project/public/${id}`, {
      headers: {
        platform: "ecoregistry",
        ln: "eng"
      }
    }).then(res => res.json()), []);

  const pinJSONToIPFS = useCallback((body) => fetch(`${PINATA_URI}/pinning/pinJSONToIPFS`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then((data) => {
      if(data.error) {
        notification.error({
          message: data.error.reason,
          description: data.error.details
        });
      }
      if(data.IpfsHash) {
        dispatch({
          type: "setUrl",
          payload: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
        });
      }
    })
  , []);

  const pinProjectToIPFS = async ({ projectId, ...values }) => {
    dispatch({
      type: "setLoading",
      payload: true
    });
    const project = await fetchProject(projectId);

    if(project?.codeMessages?.[0]) {
      notification.error({
        message: project.codeMessages[0].codeMessage
      });
    }
    await pinJSONToIPFS({...project, ...values});
    notification.success({
      message: `${values.asset_name} was pined to IPFS`
    });
    dispatch({
      type: "setLoading",
      payload: false
    });
  }

  return {
    loading, url,
    pinProjectToIPFS
  };
};

export default useEcoRegistry;
