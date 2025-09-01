import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Smartphone, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  planName: string;
  onSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, planName, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your M-Pesa phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: amount,
          phone_number: phoneNumber,
          method: 'M-PESA'
        }
      });

      if (error) throw error;

      setPaymentStatus('pending');
      toast({
        title: "Payment initiated",
        description: "Please check your phone for M-Pesa prompt",
      });

      // Poll for payment status
      setTimeout(() => checkPaymentStatus(data.id), 10000);
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { payment_id: paymentId }
      });

      if (error) throw error;

      if (data.state === 'COMPLETE') {
        setPaymentStatus('success');
        toast({
          title: "Payment successful!",
          description: `Welcome to ${planName}`,
        });
        onSuccess?.();
      } else if (data.state === 'FAILED') {
        setPaymentStatus('failed');
        toast({
          title: "Payment failed",
          description: "Please try again",
          variant: "destructive"
        });
      } else {
        // Continue polling
        setTimeout(() => checkPaymentStatus(paymentId), 5000);
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending':
        return <Clock className="h-6 w-6 text-warning animate-spin" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <Smartphone className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Pay with M-Pesa
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-semibold">KES {amount}</p>
          <p className="text-muted-foreground">{planName}</p>
        </div>
        
        {!paymentStatus && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button 
              onClick={handlePayment} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? 'Processing...' : `Pay KES ${amount}`}
            </Button>
          </>
        )}

        {paymentStatus === 'pending' && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Check your phone for M-Pesa prompt...
            </p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-4 text-success">
            <p>Payment successful! Enjoy your premium features.</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center py-4">
            <p className="text-destructive mb-2">Payment failed</p>
            <Button onClick={() => setPaymentStatus('')} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

const PricingPlans = () => {
  const plans = [
    {
      name: 'Basic',
      price: 500,
      features: ['10 AI chats per day', 'Basic quizzes', 'File upload'],
      popular: false
    },
    {
      name: 'Premium',
      price: 1500,
      features: ['Unlimited AI chats', 'Advanced quizzes', 'Study groups', 'Progress tracking'],
      popular: true
    },
    {
      name: 'Pro',
      price: 3000,
      features: ['Everything in Premium', 'Priority support', 'Custom study plans', 'Analytics'],
      popular: false
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
              Most Popular
            </Badge>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="text-3xl font-bold">
              KES {plan.price}
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Choose Plan
                </Button>
              </DialogTrigger>
              <PaymentModal 
                amount={plan.price} 
                planName={plan.name}
              />
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingPlans;