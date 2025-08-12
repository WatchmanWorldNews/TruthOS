import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubscriptionPlansProps {
  onSelectPlan: (planType: 'monthly' | 'annual') => void;
}

export default function SubscriptionPlans({ onSelectPlan }: SubscriptionPlansProps) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Mindfulness Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get unlimited access to thousands of meditations, exclusive content, and advanced features</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-gray-50 border-2 border-gray-200">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-600">Perfect to get started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">5 daily meditations</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Basic progress tracking</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">7-day intro challenge</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Community access</span>
                </li>
              </ul>
              
              <Button 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                disabled
                data-testid="button-free-plan"
              >
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Monthly */}
          <Card className="bg-white border-2 border-primary-600 relative shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary-600 text-white px-6 py-2">Most Popular</Badge>
            </div>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Monthly</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$9.99</div>
                <p className="text-gray-600">per month</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">10,000+ guided sessions</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Offline download</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">50+ expert guides</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Customizable sessions</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Advanced progress tracking</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Premium sleep content</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Exclusive challenges</span>
                </li>
              </ul>
              
              <Button 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                onClick={() => onSelectPlan('monthly')}
                data-testid="button-monthly-plan"
              >
                Start 7-Day Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Premium Annual */}
          <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Annual</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$69.99</div>
                <p className="text-gray-600">per year</p>
                <Badge className="bg-green-100 text-green-800 mt-2">Save $50/year</Badge>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Everything in Monthly</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Early access to new content</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Priority customer support</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Annual mindfulness report</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-crown text-amber-500 mr-3"></i>
                  <span className="text-gray-700">Exclusive annual member perks</span>
                </li>
              </ul>
              
              <Button 
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white"
                onClick={() => onSelectPlan('annual')}
                data-testid="button-annual-plan"
              >
                Start 7-Day Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>All plans include a 7-day free trial. Cancel anytime. No commitment.</p>
        </div>
      </div>
    </section>
  );
}
