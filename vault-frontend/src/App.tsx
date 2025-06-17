import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./helper/CheckAuth";
import { ViewVaults } from "./pages/ViewVaults";
import CapsuleDetails from "./pages/Details";
import SharedCapsules from "./pages/SharedCapsules";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path='/auth/*' element={<Auth />} />
          <Route path='/users/dashboard' element = {
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute> 
            
        } />
        <Route path='/users/dashboard/capsules' element = {
          <ProtectedRoute>
             <ViewVaults />
          </ProtectedRoute>
        } />
        <Route path="/users/dashboard/capsules/:vaultId/details" element = {
          <ProtectedRoute>
            <CapsuleDetails/>
          </ProtectedRoute>
        } />
        <Route path="/users/dashboard/capsules/shared" element = {
          <ProtectedRoute>
            <SharedCapsules/>
          </ProtectedRoute>
        }
        />
        <Route path="/auth/forgot-password" element={
          <ForgotPassword/>
        }/>
      
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
