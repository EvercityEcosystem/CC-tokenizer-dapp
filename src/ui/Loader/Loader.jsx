import React from "react";

import { Spin } from "antd";

const Loader = ({ spinning, tip, children, style }) => (
  <Spin spinning={spinning} tip={tip} style={style}>
    {children}
  </Spin>
);

export default Loader;
