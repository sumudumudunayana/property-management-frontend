import { useAuth } from "../context/AuthContext";

import "../styles/components/BuyerTopbar.css";

const BuyerTopbar = ({ title }) => {
  const { user } = useAuth();

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "B";

  return (
    <header className="propertyhub-buyer-topbar">
      <div className="propertyhub-buyer-topbar-heading">
        <p>BUYER PORTAL</p>

        <h2>{title}</h2>
      </div>

      <div className="propertyhub-buyer-topbar-profile">
       

        
      </div>
    </header>
  );
};

export default BuyerTopbar;
