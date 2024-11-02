import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import VolunteerBlue from "./pages/VolunteerBlue";
import VolunteerRed from "./pages/VolunteerRed";
import ScoreBoard from "./pages/ScoreBoard";
import Start from "./pages/Start";
import { useEffect } from "react";
import Goal from "./pages/Goal";
import Referee from "./pages/Referee";

const App: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();

   // QRChecker function to handle QR code scanning and navigation
   const QRChecker = () => {
      const params = new URLSearchParams(location.search);
      const isScanned = params.get("scanned");
      const role = params.get("role");

      useEffect(() => {
         if (isScanned === "true" && role) {
            localStorage.setItem("userRole", role);
            navigate(`/${role}`); // Navigate based on the role immediately
         }
      }, [isScanned, role, navigate]);

      return null;
   };

   // PrivateRoute function for role-based access
   const PrivateRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole: string }) => {
      const userRole = localStorage.getItem("userRole");
      // Redirect unauthorized roles or missing roles
      if (userRole !== requiredRole) return <Navigate to="/" />;
      return children;
   };

   // Redirect volunteers from accessing the home route
   const ProtectedHome = () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole?.includes("volunteer")) {
         return <Navigate to={`/${userRole}`} />;
      }
      return <Home />;
   };

   return (
      <>
         <QRChecker /> {/* Execute QR check on each route */}
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<ProtectedHome />} />
               <Route
                  path="volunteer-red"
                  element={
                     <PrivateRoute requiredRole="volunteer-red">
                        <VolunteerRed />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="volunteer-blue"
                  element={
                     <PrivateRoute requiredRole="volunteer-blue">
                        <VolunteerBlue />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="volunteer-goal"
                  element={
                     <PrivateRoute requiredRole="volunteer-goal">
                        <Goal />
                     </PrivateRoute>
                  }
               />
               <Route path="score_board" element={<ScoreBoard />} />
               <Route path="start" element={<Start />} />
               <Route path="referee" element={<Referee />} />
            </Route>
         </Routes>
      </>
   );
};

export default App;
