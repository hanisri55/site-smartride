import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const appRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/onboarding",
  "/dashboard",
  "/profile",
  "/resume-analysis",
  "/assessment",
  "/assessment/results",
  "/skills",
  "/skill-gaps",
  "/jobs",
  "/jobs/:id",
  "/career-readiness",
  "/skill-impact",
  "/roadmap",
  "/analytics",
  "/job-market",
  "/assistant",
  "/notifications",
  "/settings",
  "/evaluation",
];

function Router() {
  return (
    <Switch>
      {appRoutes.map((path) => (
        <Route key={path} path={path} component={Home} />
      ))}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
