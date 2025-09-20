import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";
import ExclusiveCollections from "@/pages/exclusive-collections";
import UltraPremium from "@/pages/ultra-premium";
import LimitedEditions from "@/pages/limited-editions";
import QuizResults from "@/pages/quiz-results";
import CheckoutPage from "@/pages/checkout";
import PaymentPage from "@/pages/payment";
import OrderConfirmationPage from "@/pages/order-confirmation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/exclusive-collections" component={ExclusiveCollections} />
      <Route path="/ultra-premium" component={UltraPremium} />
      <Route path="/limited-editions" component={LimitedEditions} />
      <Route path="/quiz-results" component={QuizResults} /> {/* Add this route */}
  <Route path="/checkout" component={CheckoutPage} />
  <Route path="/payment" component={PaymentPage} />
  <Route path="/order-confirmation" component={OrderConfirmationPage} />
  <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;