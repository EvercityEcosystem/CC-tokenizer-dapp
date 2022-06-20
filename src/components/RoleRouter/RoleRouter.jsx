import React from "react";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "../../utils/storage";
import ErrorFound from "../../ui/ErrorFound/ErrorFound";

const RoleRouter = ({ roles, children }) => {
  const { role } = getCurrentUser();
  return roles.includes(role) ? (
    children || <Outlet />
  ) : (
    <ErrorFound status={403} />
  );
};

export default RoleRouter;
