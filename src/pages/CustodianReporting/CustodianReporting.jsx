import React, { useEffect, useState } from "react";
import { Statistic } from "antd";

import usePolkadot from "../../hooks/usePolkadot";
import Container from "../../ui/Container/Container";


const CustodianReporting = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const { totalSupplyEverUSD } = usePolkadot();

  useEffect(() => {
    const getTotalSupply = async () => {
      const result = await totalSupplyEverUSD();
      setTotalSupply(result.toFixed(2));
    };

    getTotalSupply();
  }, [totalSupplyEverUSD]);

  return (
    <Container>
      <Statistic suffix="$" title="Total supply EVERUSD" value={totalSupply} />
    </Container>
  );
};

export default CustodianReporting;
