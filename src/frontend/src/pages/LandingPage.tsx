import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Utensils, Heart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Discover Affordable Street Food Near You
              </h1>
              <p className="text-xl text-muted-foreground">
                LocalBuddy connects students, migrants, and budget-conscious food lovers with local street vendors
                offering delicious, affordable meals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={() => navigate({ to: '/customer' })} className="text-lg">
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Food Near Me
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/vendor' })} className="text-lg">
                  <Utensils className="mr-2 h-5 w-5" />
                  I'm a Vendor
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/localbuddy-hero.dim_1600x900.png"
                alt="Street food vendors and customers"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How LocalBuddy Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make it easy to discover and support local street food vendors in your community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Discover Vendors</CardTitle>
                <CardDescription>
                  Browse an interactive map to find street food vendors near you. See their location, menu, and prices
                  at a glance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Affordable Meals</CardTitle>
                <CardDescription>
                  Find budget-friendly food options perfect for students and newcomers. Filter by price range and food
                  type.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Support Local</CardTitle>
                <CardDescription>
                  Connect directly with local vendors and support small businesses in your community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <Heart className="h-12 w-12 text-primary mx-auto" />
                <h2 className="text-3xl md:text-4xl font-bold">Join the LocalBuddy Community</h2>
                <p className="text-lg text-muted-foreground">
                  Whether you're looking for affordable meals or want to share your delicious street food with the
                  community, LocalBuddy is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" onClick={() => navigate({ to: '/customer' })}>
                    Start Exploring
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate({ to: '/vendor' })}>
                    Become a Vendor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
