import React, { useEffect, useState } from "react";
import { message, Statistic } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import { getCurrentUser } from "../../utils/storage";
import usePolkadot from "../../hooks/usePolkadot";

import styles from "./Profile.module.less";
import { ROLES } from "../../utils/roles";
import Container from "../../ui/Container/Container";

const Profile = () => {
  const { address } = getCurrentUser();

  return (
    <Container align="start">
      <div className={styles.address}>
        <Statistic
          className={styles.statistic}
          title="Address"
          value={address}
        />
        <CopyOutlined
          className={styles.copyIcon}
          onClick={() => {
            navigator.clipboard.writeText(address);
            message.success("Address copied!");
          }}
        />
      </div>
    </Container>
  );
};

export default Profile;
