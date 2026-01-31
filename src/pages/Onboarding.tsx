import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, MessageCircle, Shield, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import logo from '@/assets/unsaid-logo.png';

const steps = [
  {
    icon: MessageCircle,
    title: 'Welcome to UNSAID',
    description: 'A safe space to share your thoughts freely and anonymously.',
  },
  {
    icon: Shield,
    title: 'Your Privacy Matters',
    description: 'Post anonymously without revealing your identity. Your secrets are safe.',
  },
  {
    icon: Users,
    title: 'Join the Community',
    description: 'Connect with others who share your experiences and feelings.',
  },
  {
    icon: Sparkles,
    title: 'Ready to Start?',
    description: 'Create your anonymous alias and start sharing what\'s on your mind.',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      navigate('/register');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-unsaid">
        <CardContent className="pt-8 pb-6">
          <div className="text-center">
            <img src={logo} alt="UNSAID" className="mx-auto mb-6 h-16 w-auto" />
            
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-unsaid text-white">
              <CurrentIcon className="h-10 w-10" />
            </div>

            <h2 className="mb-3 text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="mb-8 text-muted-foreground">{steps[currentStep].description}</p>

            {/* Progress dots */}
            <div className="mb-8 flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStep} className="flex-1 bg-gradient-unsaid">
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
