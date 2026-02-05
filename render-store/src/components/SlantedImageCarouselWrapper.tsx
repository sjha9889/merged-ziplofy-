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

const generateTransform = (index: number, rotationRange: { min: number; max: number }) => {
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
  const duplicatedImages = useMemo(() => [...images, ...images], [images]);
  const imageTransforms = useMemo(() => {
    return duplicatedImages.map((_, index) => generateTransform(index, rotationRange));
  }, [duplicatedImages.length, rotationRange]);

  const imageWidth = 260;
  const imageGap = 16;
  const singleSetWidth = images.length * (imageWidth + imageGap);
  const totalWidth = singleSetWidth * 2;
  
  // Create 3 animation IDs for 3 rows
  const animationId1 = `carousel-${singleSetWidth}-row1`;
  const animationId2 = `carousel-${singleSetWidth}-row2`;
  const animationId3 = `carousel-${singleSetWidth}-row3`;
  
  // Different animation durations for visual interest (slightly different speeds)
  const duration1 = animationDuration;
  const duration2 = animationDuration * 1.2; // Slower
  const duration3 = animationDuration * 0.8; // Faster

  // Distribute images across 3 rows
  const imagesPerRow = Math.ceil(duplicatedImages.length / 3);
  const row1Images = duplicatedImages.slice(0, imagesPerRow);
  const row2Images = duplicatedImages.slice(imagesPerRow, imagesPerRow * 2);
  const row3Images = duplicatedImages.slice(imagesPerRow * 2);

  const renderRow = (rowImages: string[], animationId: string, duration: number, rowIndex: number) => {
    const rowTransforms = rowImages.map((_, index) => {
      const globalIndex = rowIndex * imagesPerRow + index;
      return imageTransforms[globalIndex] || imageTransforms[index % imageTransforms.length];
    });

    return (
      <div
        key={`row-${rowIndex}`}
        className="flex items-center"
        style={{
          width: `${totalWidth}px`,
          willChange: 'transform',
          animation: `${animationId} ${duration}s linear infinite`,
        } as React.CSSProperties}
      >
        {rowImages.map((image, index) => {
          const { rotation, translateX, translateY } = rowTransforms[index];
          return (
            <div
              key={`row-${rowIndex}-image-${index}`}
              className="shrink-0 relative"
              style={{
                width: `${imageWidth}px`,
                height: `${imageWidth}px`,
                marginRight: index < rowImages.length - 1 ? `${imageGap}px` : '0',
                transform: `rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`,
              }}
            >
              <img
                src={image}
                alt={`Carousel image ${(index % images.length) + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-md border border-[#e8e0d5]/50"
                style={{ filter: 'brightness(0.96) saturate(0.85)' }}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/${imageWidth}x${imageWidth}?text=Image+${(index % images.length) + 1}`;
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes ${animationId1} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${singleSetWidth}px); }
        }
        @keyframes ${animationId2} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${singleSetWidth}px); }
        }
        @keyframes ${animationId3} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${singleSetWidth}px); }
        }
      `}</style>
      <div className="relative min-h-screen w-full overflow-hidden bg-[#fefcf8]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {/* Row 1 - Top */}
          <div className="absolute top-[10%] left-0 w-full" style={{ height: '260px' }}>
            {renderRow(row1Images, animationId1, duration1, 0)}
          </div>
          {/* Row 2 - Middle */}
          <div className="absolute top-[40%] left-0 w-full" style={{ height: '260px' }}>
            {renderRow(row2Images, animationId2, duration2, 1)}
          </div>
          {/* Row 3 - Bottom */}
          <div className="absolute top-[70%] left-0 w-full" style={{ height: '260px' }}>
            {renderRow(row3Images, animationId3, duration3, 2)}
          </div>
        </div>
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
