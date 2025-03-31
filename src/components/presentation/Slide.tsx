import { ReactNode } from 'react';

interface SlideProps {
  children: ReactNode;
  className?: string;
}

export function Slide({ children, className = '' }: SlideProps) {
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="max-w-4xl w-full">
        {children}
      </div>
    </div>
  );
}
