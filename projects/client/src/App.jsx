import axios from "axios";
import logo from "./logo.svg";
import { useEffect, useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateWrapper from "./wrapper/PrivateWrapper";
import Home from "./pages/Home";
import PublicWrapper from "./wrapper/PublicWrapper";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route element={<PublicWrapper />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
