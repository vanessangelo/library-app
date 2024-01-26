import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateWrapper from "./wrapper/PrivateWrapper";
import Home from "./pages/Home";
import PublicWrapper from "./wrapper/PublicWrapper";
import HistoryPage from "./pages/HistoryPage";
import SingleBookPage from "./pages/SingleBookPage";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/single-book/:id" element={<SingleBookPage />} />
        </Route>

        <Route element={<PublicWrapper />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
