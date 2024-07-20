import React from "react";
import './LoadingSpinner.scss'

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay" id="loading-spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
