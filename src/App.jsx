import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import SellerDashboard from "./pages/seller/SellerDashboard";
import MyProperties from "./pages/seller/MyProperties";
import PropertyForm from "./pages/seller/PropertyForm";
import BuyerOffers from "./pages/buyer/BuyerOffers";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import SellerOffers from "./pages/seller/SellerOffers";
import ProtectedRoute from "./components/ProtectedRoute";
import BuyerProperties from "./pages/buyer/BuyerProperties";
import PropertyOffers from "./pages/seller/PropertyOffers";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        {/* Landing page → Login */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =========================
                    SELLER
                ========================= */}

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRole="SELLER">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/properties"
          element={
            <ProtectedRoute allowedRole="SELLER">
              <MyProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/properties/create"
          element={
            <ProtectedRoute allowedRole="SELLER">
              <PropertyForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/properties/edit/:id"
          element={
            <ProtectedRoute allowedRole="SELLER">
              <PropertyForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/offers"
          element={
            <ProtectedRoute allowedRole="SELLER">
              <SellerOffers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/properties/:propertyId/offers"
          element={
            <ProtectedRoute allowedRole="SELLER">
              <PropertyOffers />
            </ProtectedRoute>
          }
        />

        {/* =========================
                    BUYER
                ========================= */}

        <Route
          path="/buyer"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/properties"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <BuyerProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/offers"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <BuyerOffers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
