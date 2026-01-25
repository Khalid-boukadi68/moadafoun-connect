import React, { useState } from 'react';

const steps = [
  'Welcome',
  'Step 1: User Information',
  'Step 2: Preferences',
  'Complete'
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <h2>{steps[currentStep]}</h2>
      <div>
        <div style={{ width: '100%', background: '#e0e0e0' }}>
          <div
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              background: '#3f51b5',
              height: '10px',
            }}
          />
        </div>
        <p>Step {currentStep + 1} of {steps.length}</p>
      </div>

      {currentStep === 0 && <div>Welcome to the onboarding process!</div>}
      {currentStep === 1 && <div>Please enter your user information.</div>}
      {currentStep === 2 && <div>Set your preferences.</div>}
      {currentStep === 3 && <div>Onboarding complete!</div>}

      <div>
        <button onClick={prevStep} disabled={currentStep === 0}>Back</button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default Onboarding;