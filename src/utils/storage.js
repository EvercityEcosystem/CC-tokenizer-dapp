const getCurrentUser = () => ({
  address: localStorage.getItem("userAddress"),
  role: Number(localStorage.getItem("userRole")),
});

const saveCurrentUser = ({address, role}) => {
  if (!address || !role) {
    return;
  }

  localStorage.setItem("userAddress", address);
  localStorage.setItem("userRole", role);
};

const forgetCurrentUser = () => {
  localStorage.removeItem("userAddress");
  localStorage.removeItem("userRole");
};

export { getCurrentUser, saveCurrentUser, forgetCurrentUser };
