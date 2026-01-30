import React, { useMemo } from 'react';

interface SlantedImageCarouselWrapperProps {
  children: React.ReactNode;
  images?: string[];
  animationDuration?: number;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1564422296086-a0a72d0c1f5e?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552581234-26160f608093?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&h=500&fit=crop',
];

const SlantedImageCarouselWrapper: React.FC<SlantedImageCarouselWrapperProps> = ({
  children,
  images = DEFAULT_IMAGES,
  animationDuration = 100,
}) => {
  const boxWidth = 300;
  const boxHeight = 400;
  const imageGap = 30; // Positive gap for spacing between columns
  const rowGap = 620; // Spacing between rows
  const rowRotation = 3; // Rotation angle for rows in degrees
  const boxesPerView = 6;
  const singleSetWidth = boxesPerView * (boxWidth + imageGap);
  const boxesForRow = boxesPerView * 2; // Each row needs 12 boxes
  const totalWidth = boxesForRow * 2 * (boxWidth + imageGap); // Width for duplicated boxes
  
  // Generate separate box arrays for each row, duplicated for seamless loop
  const topRowBoxes = useMemo(() => {
    const base = Array.from({ length: boxesForRow }, (_, i) => i);
    return [...base, ...base]; // Duplicate for seamless loop
  }, [boxesForRow]);
  
  const middleRowBoxes = useMemo(() => {
    const base = Array.from({ length: boxesForRow }, (_, i) => i + boxesForRow);
    return [...base, ...base]; // Duplicate for seamless loop
  }, [boxesForRow]);
  
  const bottomRowBoxes = useMemo(() => {
    const base = Array.from({ length: boxesForRow }, (_, i) => i + boxesForRow * 2);
    return [...base, ...base]; // Duplicate for seamless loop
  }, [boxesForRow]);

  // Generate unique animation name based on width to avoid conflicts
  const animationId = `carousel-${singleSetWidth}`;

  return (
    <>
      {/* CSS Animation */}
      <style>{`
        @keyframes ${animationId} {
          0% {
            transform: rotate(${rowRotation}deg) translateX(0);
          }
          100% {
            transform: rotate(${rowRotation}deg) translateX(-${singleSetWidth}px);
          }
        }
        @keyframes ${animationId}-reverse {
          0% {
            transform: rotate(${rowRotation}deg) translateX(-${singleSetWidth}px);
          }
          100% {
            transform: rotate(${rowRotation}deg) translateX(0);
          }
        }
        @keyframes ${animationId}-fast {
          0% {
            transform: rotate(${rowRotation}deg) translateX(0);
          }
          100% {
            transform: rotate(${rowRotation}deg) translateX(-${singleSetWidth}px);
          }
        }
      `}</style>
      
      <div className="relative min-h-screen w-screen bg-[#191919] overflow-hidden">
        {/* Background Carousel - Multiple layers for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Row */}
          <div
            className="absolute left-0 flex items-start z-0"
            style={{
              top: `${rowGap}px`,
              width: `${totalWidth}px`,
              height: 'auto',
              willChange: 'transform',
              animation: `${animationId} ${animationDuration}s linear infinite`,
              transformOrigin: 'center center',
            } as React.CSSProperties}
          >
            {topRowBoxes.map((boxIndex) => {
              const imageIndex = boxIndex % images.length;
              const imageUrl = images[imageIndex];
              return (
                <div
                  key={`top-${boxIndex}`}
                  className="shrink-0 relative rounded-lg overflow-hidden"
                  style={{
                    width: `${boxWidth}px`,
                    height: `${boxHeight}px`,
                    marginRight: `${imageGap}px`,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Carousel image ${imageIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/${boxWidth}x${boxHeight}?text=Image+${imageIndex + 1}`;
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Middle Row */}
          <div
            className="absolute left-0 flex items-center z-0"
            style={{
              top: `calc(50% - ${boxHeight / 2}px)`,
              width: `${totalWidth}px`,
              height: 'auto',
              willChange: 'transform',
              animation: `${animationId}-reverse ${animationDuration * 1.2}s linear infinite`,
              transformOrigin: 'center center',
              transform: `rotate(${rowRotation}deg) translateX(-${singleSetWidth}px)`, // Initial position for reverse animation
            } as React.CSSProperties}
          >
            {middleRowBoxes.map((boxIndex) => {
              const imageIndex = boxIndex % images.length;
              const imageUrl = images[imageIndex];
              return (
                <div
                  key={`middle-${boxIndex}`}
                  className="shrink-0 relative rounded-lg overflow-hidden"
                  style={{
                    width: `${boxWidth}px`,
                    height: `${boxHeight}px`,
                    marginRight: `${imageGap}px`,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Carousel image ${imageIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/${boxWidth}x${boxHeight}?text=Image+${imageIndex + 1}`;
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Row */}
          <div
            className="absolute left-0 flex items-end z-0"
            style={{
              bottom: `${rowGap}px`,
              width: `${totalWidth}px`,
              height: 'auto',
              willChange: 'transform',
              animation: `${animationId}-fast ${animationDuration * 0.9}s linear infinite`,
              transformOrigin: 'center center',
            } as React.CSSProperties}
          >
            {bottomRowBoxes.map((boxIndex) => {
              const imageIndex = boxIndex % images.length;
              const imageUrl = images[imageIndex];
              return (
                <div
                  key={`bottom-${boxIndex}`}
                  className="shrink-0 relative rounded-lg overflow-hidden"
                  style={{
                    width: `${boxWidth}px`,
                    height: `${boxHeight}px`,
                    marginRight: `${imageGap}px`,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Carousel image ${imageIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/${boxWidth}x${boxHeight}?text=Image+${imageIndex + 1}`;
                    }}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Dark overlay backdrop - above images but below content */}
          <div 
            className="absolute inset-0 bg-black/40 pointer-events-none"
            style={{ zIndex: 5 }}
          ></div>
        </div>

        {/* Content Overlay - Centered */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="relative w-full max-w-md px-4 sm:px-8 py-8">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SlantedImageCarouselWrapper;

