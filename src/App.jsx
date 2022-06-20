import {Route, Routes} from "react-router-dom";
import {useEffect} from "react";
import Loader from "./ui/Loader/Loader";
import usePolkadot from "./hooks/usePolkadot";

import Layout from "./ui/Layout/Layout";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import ProtectedRouter from "./components/ProtectedRouter/ProtectedRouter";
import RoleRouter from "./components/RoleRouter/RoleRouter";
import CustodianRequests from "./pages/CustodianRequests/CustodianRequests";
import CustodianTokens from "./pages/CustodianTokens/CustodianTokens";
import CustodianReporting from "./pages/CustodianReporting/CustodianReporting";
import CustodianProjects from "./pages/CustodianProjects/CustodianProjects";
import InvestorTokens from "./pages/InvestorTokens/InvestorTokens";
import Profile from "./pages/Profile/Profile";

function App() {
  const { initAPI, isAPIReady } = usePolkadot();

  useEffect(() => {
    initAPI();
  }, []);

  return (
    <Loader spinning={!isAPIReady} tip="Connecting to blockchain node">
      <Layout>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />}/>
          <Route path="dapp" children={<ProtectedRouter />}>
            <Route path="profile" element={<Profile />} />
            <Route path="custodian" element={<RoleRouter roles={[2]} />}>
              <Route path="requests" element={<CustodianRequests />} />
              <Route path="tokens/:actionType" element={<CustodianTokens />} />
              <Route path="reporting" element={<CustodianReporting />} />
              <Route path="projects" element={<CustodianProjects />} />
            </Route>
            <Route path="investor" element={<RoleRouter roles={[8]} />}>
              <Route path="tokens/:action" element={<InvestorTokens />} />
            </Route>
          </Route>
        </Routes>
      </Layout>
    </Loader>
  )
}

export default App
