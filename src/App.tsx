import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Stories from "./pages/Stories";
import Sectors from "./pages/Sectors";
import SectorFeed from "./pages/SectorFeed";
import Pulse from "./pages/Pulse";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to stories */}
            <Route path="/" element={<Navigate to="/stories" replace />} />
            
            {/* Main app routes */}
            <Route path="/stories" element={<Stories />} />
            <Route path="/sectors" element={<Sectors />} />
            <Route path="/sectors/:sector" element={<SectorFeed />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="/about" element={<About />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* Legacy routes - redirect */}
            <Route path="/feed" element={<Navigate to="/stories" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
