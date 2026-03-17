import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Wheell from "./pages/Wheel";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";




function App() {
  return (
    
      <Routes>
       
        <Route path="/" element={<Wheell />} />
        <Route path="/wheel" element={<Wheell />} />
        <Route path="/login" element={<Login />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
 <Route path="/register" element={<Register/>} />


<Route path="/profile" element={<Profile />} />
      <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    
  );
}

export default App;
