import React, { useMemo } from 'react';

interface SlantedImageCarouselWrapperProps {
  children: React.ReactNode;
  images?: string[];
  rotationRange?: { min: number; max: number };
  animationDuration?: number;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1564422296086-a0a72d0c1f5e?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center',
];

// Generate consistent random values based on index
const generateTransform = (index: number, rotationRange: { min: number; max: number }) => {
  // Use index as seed for consistent transforms
  const seed = index * 0.1;
  const rotation = rotationRange.min + (Math.sin(seed) * 0.5 + 0.5) * (rotationRange.max - rotationRange.min);
  const translateX = (Math.cos(seed * 2) * 20);
  const translateY = (Math.sin(seed * 3) * 15);
  const marginTop = (Math.sin(seed * 4) * 0.5 + 0.5) * 80;
  
  return { rotation, translateX, translateY, marginTop };
};

const SlantedImageCarouselWrapper: React.FC<SlantedImageCarouselWrapperProps> = ({
  children,
  images = DEFAULT_IMAGES,
  rotationRange = { min: -8, max: 8 },
  animationDuration = 60,
}) => {
  // Duplicate images for seamless loop
  const duplicatedImages = useMemo(() => [...images, ...images], [images]);

  // Calculate image positions with consistent rotations
  const imageTransforms = useMemo(() => {
    return duplicatedImages.map((_, index) => generateTransform(index, rotationRange));
  }, [duplicatedImages.length, rotationRange]);

  const imageWidth = 260;
  const imageGap = 16;
  const singleSetWidth = images.length * (imageWidth + imageGap);
  const totalWidth = singleSetWidth * 2; // Duplicated set

  // Generate unique animation name based on width to avoid conflicts
  const animationId = `carousel-${singleSetWidth}`;

  return (
    <>
      {/* CSS Animation */}
      <style>{`
        @keyframes ${animationId} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${singleSetWidth}px);
          }
        }
      `}</style>
      
      <div className="relative min-h-screen w-full overflow-hidden bg-gray-50">
        {/* Background Carousel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <div
            className="flex h-full items-center"
            style={{
              width: `${totalWidth}px`,
              willChange: 'transform',
              animation: `${animationId} ${animationDuration}s linear infinite`,
            } as React.CSSProperties}
          >
            {duplicatedImages.map((image, index) => {
              const { rotation, translateX, translateY, marginTop } = imageTransforms[index];

              return (
                <div
                  key={`image-${index}`}
                  className="shrink-0 relative"
                  style={{
                    width: `${imageWidth}px`,
                    height: `${imageWidth}px`,
                    marginRight: index < duplicatedImages.length - 1 ? `${imageGap}px` : '0',
                    marginTop: `${marginTop}px`,
                    transform: `rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`,
                  }}
                >
                  <img
                    src={image}
                    alt={`Carousel image ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-md border border-gray-200/50"
                    style={{
                      filter: 'brightness(0.96) saturate(0.85)',
                    }}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/${imageWidth}x${imageWidth}?text=Image+${(index % images.length) + 1}`;
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto px-4 py-8">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SlantedImageCarouselWrapper;

