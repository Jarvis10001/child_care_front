import React from 'react';
import styles from './Aurora.module.css';

export const AuroraBackground = ({
  className = "",
  children = "",
}) => {
  return (
    <div className={`${styles.auroraBackground} min-h-screen ${className}`}>
      <div className={`${styles.auroraGradient} absolute inset-0`}></div>
      <div className={`${styles.floatingOrbs} absolute inset-0`}></div>
      <div className={`${styles.content} relative h-full`}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;