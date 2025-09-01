import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PricingPlans from '@/components/PricingPlans';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Crown, Zap } from 'lucide-react';

const PricingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-learning flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-learning bg-clip-text text-transparent">
                StudySphere
              </h1>
            </Link>
            <Button variant="outline" asChild>
              <Link to="/">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Crown className="h-16 w-16 mx-auto mb-6 text-primary-foreground" />
          <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Take your learning to the next level with unlimited AI tutoring, 
            advanced quizzes, and personalized study plans.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your learning journey. All plans include 
              our core features with different usage limits and premium capabilities.
            </p>
          </div>
          <PricingPlans />
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Go Premium?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Unlimited AI Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get unlimited access to our AI tutor for instant help with any subject, 
                  24/7 availability, and personalized explanations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 mx-auto mb-4 text-secondary" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track your progress with detailed analytics, identify weak areas, 
                  and get personalized study recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Crown className="h-12 w-12 mx-auto mb-4 text-accent" />
                <CardTitle>Premium Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get priority customer support, early access to new features, 
                  and direct feedback channels with our development team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;