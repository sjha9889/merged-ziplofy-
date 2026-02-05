import React from 'react';

export type WaveType = 'smooth' | 'rough' | 'gentle' | 'dramatic' | 'random';

export interface WaveDividerProps {
  /** Wave pattern type */
  type?: WaveType;
  /** Fill color (Tailwind class) */
  fillColor?: string;
  /** Wave height */
  height?: number;
  /** Wave amplitude (how high/low the peaks go) */
  amplitude?: number;
  /** Wave frequency (how many waves) */
  frequency?: number;
  /** Custom wave path (overrides type if provided) */
  customPath?: string;
  /** Additional className */
  className?: string;
  /** Position: 'top' or 'bottom' */
  position?: 'top' | 'bottom';
}

/**
 * Generates a wave path based on type and parameters
 */
const generateWavePath = (
  type: WaveType,
  amplitude: number = 30,
  frequency: number = 6
): string => {
  const width = 1440;
  const height = 120;
  const points: number[] = [];
  
  // Generate control points based on wave type
  switch (type) {
    case 'smooth':
      // Smooth, gentle curves
      for (let i = 0; i <= frequency; i++) {
        const x = (i / frequency) * width;
        const y = height / 2 + Math.sin((i / frequency) * Math.PI * 2) * amplitude;
        points.push(x, y);
      }
      break;
      
    case 'rough':
      // More dramatic, varied waves
      for (let i = 0; i <= frequency * 2; i++) {
        const x = (i / (frequency * 2)) * width;
        const baseY = height / 2;
        const variation = Math.sin((i / (frequency * 2)) * Math.PI * 4) * amplitude;
        const noise = (Math.random() - 0.5) * amplitude * 0.3;
        const y = baseY + variation + noise;
        points.push(x, y);
      }
      break;
      
    case 'gentle':
      // Very subtle, low amplitude waves
      const gentleAmplitude = amplitude * 0.5;
      for (let i = 0; i <= frequency; i++) {
        const x = (i / frequency) * width;
        const y = height / 2 + Math.sin((i / frequency) * Math.PI * 2) * gentleAmplitude;
        points.push(x, y);
      }
      break;
      
    case 'dramatic':
      // High amplitude, dramatic waves
      const dramaticAmplitude = amplitude * 1.5;
      for (let i = 0; i <= frequency; i++) {
        const x = (i / frequency) * width;
        const y = height / 2 + Math.sin((i / frequency) * Math.PI * 2) * dramaticAmplitude;
        points.push(x, y);
      }
      break;
      
    case 'random':
      // Random wave pattern
      for (let i = 0; i <= frequency * 1.5; i++) {
        const x = (i / (frequency * 1.5)) * width;
        const baseY = height / 2;
        const randomAmplitude = amplitude * (0.5 + Math.random());
        const y = baseY + (Math.random() - 0.5) * randomAmplitude * 2;
        points.push(x, y);
      }
      break;
      
    default:
      // Default smooth wave
      for (let i = 0; i <= frequency; i++) {
        const x = (i / frequency) * width;
        const y = height / 2 + Math.sin((i / frequency) * Math.PI * 2) * amplitude;
        points.push(x, y);
      }
  }
  
  // Build SVG path with smooth curves
  let path = `M0,${height / 2}`;
  
  for (let i = 0; i < points.length - 2; i += 2) {
    const x1 = points[i];
    const y1 = points[i + 1];
    const x2 = points[i + 2];
    const y2 = points[i + 3];
    
    const cp1x = x1 + (x2 - x1) / 3;
    const cp1y = y1;
    const cp2x = x2 - (x2 - x1) / 3;
    const cp2y = y2;
    
    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
  }
  
  // Close the path
  path += ` L${width},${height} L0,${height} Z`;
  
  return path;
};

const WaveDivider: React.FC<WaveDividerProps> = ({
  type = 'smooth',
  fillColor = 'fill-gray-50',
  height = 20,
  amplitude = 30,
  frequency = 6,
  customPath,
  className = '',
  position = 'bottom',
}) => {
  const wavePath = customPath || generateWavePath(type, amplitude, frequency);
  
  // Flip wave if position is top
  const transform = position === 'top' ? 'rotate(180)' : '';
  
  return (
    <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 ${className}`}>
      <svg 
        className={`w-full ${fillColor}`}
        style={{ height: `${height * 0.25}rem` }}
        viewBox="0 0 1440 120" 
        preserveAspectRatio="none"
      >
        <g transform={transform}>
          <path d={wavePath} />
        </g>
      </svg>
    </div>
  );
};

export default WaveDivider;
