// App.tsx
import { Route, Routes, Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import VolunteerBlue from "./pages/VolunteerBlue";
import VolunteerRed from "./pages/VolunteerRed";
import ScoreBoardNew from "./pages/ScoreBoardNew";
import Start from "./pages/Start";
import Goal from "./pages/Goal";
import Unauthenticated from "./pages/Unauthenticated";
import { useEffect } from "react";
import { createToken, decodeToken } from "./tokenUtils";

interface ProtectedRouteProps {
   allowedRoles: string[]; // Array of allowed roles
   children?: React.ReactNode;
}

const App: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();

   const QRChecker = () => {
      const params = new URLSearchParams(location.search);
      const isScanned = params.get("scanned");
      const role = params.get("role");
      const pairingPoint = params.get("pairing_point");
      const password = params.get("password");

      useEffect(() => {
         // Check for admin role and password
         if (role === 'admin' && password === import.meta.env.VITE_ADMIN_PASSWORD) {
            const token = createToken(role);
            localStorage.setItem("token", token);
            Promise.resolve().then(() => navigate('/')); // Ensure token is set before navigating
         } else if (role === 'admin' && password !== import.meta.env.VITE_ADMIN_PASSWORD) {
            navigate('/unauthenticated');
         }

         // Check for volunteer roles and valid pairing points
         if (isScanned === "true" && (role === "volunteer-red" || role === "volunteer-blue")) {
            if (['1', '2', '3', '4'].includes(pairingPoint || '')) {
               const token = createToken(role, pairingPoint!);
               localStorage.setItem("token", token);
               Promise.resolve().then(() => navigate(`/${role}`)); // Redirect after setting token
            } else {
               navigate('/unauthenticated'); // Redirect if pairing point is invalid
            }
         } else if (isScanned === "true") {
            navigate('/unauthenticated'); // Redirect if role is not valid
         }
      }, [isScanned, role, pairingPoint, password]); // Dependencies added for reactivity

      return null;
   };

   const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
      const token = localStorage.getItem("token");
      let userRole: string | null = null;

      // Decode token only if it exists
      if (token) {
         const decodedToken = decodeToken(token);
         userRole = decodedToken.role;
      }

      // Check if the user's role is included in the allowed roles
      const isAuthorized = userRole && allowedRoles.includes(userRole);

      if (!isAuthorized) {
         if (userRole?.startsWith('volunteer')) {
            return <Navigate to={`/${userRole}`} replace />; // Redirect to volunteer's specific page
         } else {
            return <Navigate to="/unauthenticated" replace />; // Redirect unauthorized users
         }
      }

      return <>{children || <Outlet />}</>;
   };

   return (
      <>
         <QRChecker />
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<ProtectedRoute allowedRoles={['admin']}><Home /></ProtectedRoute>} />
               <Route path="volunteer-red" element={<ProtectedRoute allowedRoles={['admin', 'volunteer-red']}><VolunteerRed /></ProtectedRoute>} />
               <Route path="volunteer-blue" element={<ProtectedRoute allowedRoles={['admin', 'volunteer-blue']}><VolunteerBlue /></ProtectedRoute>} />
               <Route path="volunteer-goal" element={<Goal />} />
               <Route path="score_board" element={<ScoreBoardNew />} />
               <Route path="start" element={<ProtectedRoute allowedRoles={['admin']}><Start /></ProtectedRoute>} />
               <Route path="unauthenticated" element={<Unauthenticated />} />
            </Route>
         </Routes>
      </>
   );
};

export default App;
