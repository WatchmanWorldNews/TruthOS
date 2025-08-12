import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import NavigationHeader from "@/components/NavigationHeader";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ planType }: { planType: 'monthly' | 'annual' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?subscription=success`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to Premium! You now have access to all features.",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Subscription
          </h2>
          <p className="text-gray-600">
            {planType === 'annual' ? 'Annual Premium Plan - $69.99/year' : 'Monthly Premium Plan - $9.99/month'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <PaymentElement />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-full font-semibold"
            disabled={!stripe || !elements || isProcessing}
            data-testid="button-submit-payment"
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              'Start 7-Day Free Trial'
            )}
          </Button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>Your trial starts today. Cancel anytime before it ends to avoid charges.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleSelectPlan = async (planType: 'monthly' | 'annual') => {
    setSelectedPlan(planType);
    setIsCreatingSubscription(true);

    try {
      const response = await apiRequest("POST", "/api/get-or-create-subscription", { 
        planType 
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
      setSelectedPlan(null);
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock unlimited access to thousands of guided meditations, premium content, 
            and advanced features to deepen your mindfulness practice.
          </p>
        </div>

        {!selectedPlan ? (
          <>
            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">What's Included in Premium</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-infinity text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Unlimited Sessions</h3>
                    <p className="text-primary-100 text-sm">Access to 10,000+ guided meditations and mindfulness practices</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-download text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Offline Access</h3>
                    <p className="text-primary-100 text-sm">Download sessions to meditate anywhere, anytime</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-users text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">50+ Expert Guides</h3>
                    <p className="text-primary-100 text-sm">Learn from world-renowned meditation teachers</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-cog text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Customizable Sessions</h3>
                    <p className="text-primary-100 text-sm">Personalize duration, guide voice, and background sounds</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-moon text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Premium Sleep Content</h3>
                    <p className="text-primary-100 text-sm">Sleep stories, bedtime meditations, and relaxing soundscapes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chart-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Advanced Tracking</h3>
                    <p className="text-primary-100 text-sm">Detailed progress insights and mindfulness analytics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Plans */}
            <SubscriptionPlans onSelectPlan={handleSelectPlan} />

            {/* Loading State */}
            {isCreatingSubscription && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="bg-white p-8">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Setting up your subscription...</p>
                  </div>
                </Card>
              </div>
            )}
          </>
        ) : (
          <div className="py-8">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedPlan(null);
                  setClientSecret("");
                }}
                className="text-gray-600 hover:text-gray-900"
                data-testid="button-back-to-plans"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Plans
              </Button>
            </div>

            {/* Payment Form */}
            {clientSecret ? (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#6366f1',
                    },
                  },
                }}
              >
                <SubscribeForm planType={selectedPlan} />
              </Elements>
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Preparing payment form...</p>
              </div>
            )}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="text-center mt-16 pb-8">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="flex items-center text-gray-500">
              <i className="fas fa-lock mr-2"></i>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center text-gray-500">
              <i className="fas fa-credit-card mr-2"></i>
              <span className="text-sm">Cancel Anytime</span>
            </div>
            <div className="flex items-center text-gray-500">
              <i className="fas fa-shield-alt mr-2"></i>
              <span className="text-sm">7-Day Free Trial</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Powered by Stripe. Your payment information is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
