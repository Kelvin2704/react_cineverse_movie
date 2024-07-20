import React, { useState, useEffect } from 'react';
import './ScrollToTop.scss'; // We'll create this file for styling
import Button from '../button/Button';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop}>
          <img src="https://img.icons8.com/ios-filled/50/ffffff/up.png" alt="Go to top" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
    