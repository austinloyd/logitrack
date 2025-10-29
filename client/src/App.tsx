import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CustomerPortal from "./pages/CustomerPortal";
import DriverPortal from "./pages/DriverPortal";
import AdminPortal from "./pages/AdminPortal";
import SignIn from "./pages/SignIn";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/signin"} component={SignIn} />
      <Route path={"/customer"} component={CustomerPortal} />
      <Route path={"/driver"} component={DriverPortal} />
      <Route path={"/admin"} component={AdminPortal} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
