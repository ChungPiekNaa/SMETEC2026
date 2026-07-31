import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPage from "./pages/PublicPage";
import AdminPage from "./pages/AdminPage";
import RedeemPage from "./pages/RedeemPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/redeem" element={<RedeemPage />} />
      </Routes>
    </BrowserRouter>
  );
}