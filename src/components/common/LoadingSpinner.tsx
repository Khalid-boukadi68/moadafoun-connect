import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      </div>
    );
  }

  return <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />;
}

export default LoadingSpinner;
