import { useAuth } from "../context/AuthContext";

import "../styles/components/SellerTopbar.css";

const SellerTopbar = ({ title }) => {
  const { user } = useAuth();

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <header className="propertyhub-seller-topbar">
      <div className="propertyhub-seller-topbar-heading">
        <p>SELLER PORTAL</p>

        <h2>{title}</h2>
      </div>

      <div className="propertyhub-seller-topbar-profile">
        <div className="propertyhub-seller-topbar-avatar">
          {userInitial}
        </div>

        <div className="propertyhub-seller-topbar-user">
          <strong>{user?.name || "Seller"}</strong>

          <span>Seller</span>
        </div>
      </div>
    </header>
  );
};

export default SellerTopbar;