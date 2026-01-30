import React from 'react';

interface GridBackgroundWrapperProps {
  children: React.ReactNode;
  gridSize?: string;
  gridColor?: string;
  gridOpacity?: number;
}

const GridBackgroundWrapper: React.FC<GridBackgroundWrapperProps> = ({
  children,
  gridSize = '20px',
  gridColor = '102,102,102',
  gridOpacity = 0.1,
}) => {
  return (
    <>
      {/* Fixed Background Layer - CSS Grid Pattern */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(to right, rgba(${gridColor}, ${gridOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(${gridColor}, ${gridOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize} ${gridSize}`,
          backgroundPosition: '0 0',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      {/* Scrollable Content Layer */}
      <div className="min-h-screen relative" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  );
};

export default GridBackgroundWrapper;

