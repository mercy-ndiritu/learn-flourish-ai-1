import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AITutorPage from "./pages/AITutorPage";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import StudyGroupsPage from "./pages/StudyGroupsPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/ai-tutor" element={
              <ProtectedRoute>
                <AITutorPage />
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } />
            <Route path="/study-groups" element={
              <ProtectedRoute>
                <StudyGroupsPage />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
