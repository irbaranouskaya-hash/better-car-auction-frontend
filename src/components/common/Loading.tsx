import React from 'react';
import './Loading.css';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  fullScreen = false,
  text
}) => {
  const spinnerSizes = {
    sm: 24,
    md: 40,
    lg: 64,
  };

  const spinner = (
    <div className="loading-container">
      <div 
        className="spinner" 
        style={{ 
          width: spinnerSizes[size], 
          height: spinnerSizes[size] 
        }} 
      />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-fullscreen">{spinner}</div>;
  }

  return spinner;
};

