import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

const ProjectTriangle = () => {
  const [scope, setScope] = useState(50);
  const [time, setTime] = useState(50);
  const [quality, setQuality] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSide, setActiveSide] = useState(null);
  const [lockedSide, setLockedSide] = useState(null);
  
  // Calculate positions and dimensions
  const triangleSize = 300;
  const centerX = triangleSize / 2;
  const centerY = triangleSize / 2;
  const radius = triangleSize * 0.4;
  
  // Calculate triangle points
  const topPoint = { x: centerX, y: centerY - radius };
  const leftPoint = { x: centerX - radius * 0.866, y: centerY + radius * 0.5 };
  const rightPoint = { x: centerX + radius * 0.866, y: centerY + radius * 0.5 };
  
  // Toggle lock for a side
  const toggleLock = (side) => {
    if (lockedSide === side) {
      setLockedSide(null);
    } else {
      setLockedSide(side);
    }
  };

  // Handle constraint: all three values must sum to a constant (150)
  useEffect(() => {
    if (isDragging && activeSide) {
      const total = scope + time + quality;
      const target = 150;
      const diff = total - target;
      
      if (diff !== 0) {
        if (activeSide === 'scope') {
          if (lockedSide === 'time') {
            // If time is locked, adjust only quality
            setQuality(prev => Math.max(10, Math.min(90, prev - diff)));
          } else if (lockedSide === 'quality') {
            // If quality is locked, adjust only time
            setTime(prev => Math.max(10, Math.min(90, prev - diff)));
          } else {
            // Adjust time and quality when scope changes
            const timeAdjustment = diff / 2;
            const qualityAdjustment = diff / 2;
            setTime(prev => Math.max(10, Math.min(90, prev - timeAdjustment)));
            setQuality(prev => Math.max(10, Math.min(90, prev - qualityAdjustment)));
          }
        } else if (activeSide === 'time') {
          if (lockedSide === 'scope') {
            // If scope is locked, adjust only quality
            setQuality(prev => Math.max(10, Math.min(90, prev - diff)));
          } else if (lockedSide === 'quality') {
            // If quality is locked, adjust only scope
            setScope(prev => Math.max(10, Math.min(90, prev - diff)));
          } else {
            // Adjust scope and quality when time changes
            const scopeAdjustment = diff / 2;
            const qualityAdjustment = diff / 2;
            setScope(prev => Math.max(10, Math.min(90, prev - scopeAdjustment)));
            setQuality(prev => Math.max(10, Math.min(90, prev - qualityAdjustment)));
          }
        } else if (activeSide === 'quality') {
          if (lockedSide === 'scope') {
            // If scope is locked, adjust only time
            setTime(prev => Math.max(10, Math.min(90, prev - diff)));
          } else if (lockedSide === 'time') {
            // If time is locked, adjust only scope
            setScope(prev => Math.max(10, Math.min(90, prev - diff)));
          } else {
            // Adjust scope and time when quality changes
            const scopeAdjustment = diff / 2;
            const timeAdjustment = diff / 2;
            setScope(prev => Math.max(10, Math.min(90, prev - scopeAdjustment)));
            setTime(prev => Math.max(10, Math.min(90, prev - timeAdjustment)));
          }
        }
      }
    }
  }, [scope, time, quality, isDragging, activeSide, lockedSide]);

  // Calculate the position for sliders
  const getScopeSliderPosition = () => {
    const percent = scope / 100;
    return {
      x: topPoint.x + (rightPoint.x - topPoint.x) * percent,
      y: topPoint.y + (rightPoint.y - topPoint.y) * percent
    };
  };

  const getTimeSliderPosition = () => {
    const percent = time / 100;
    return {
      x: rightPoint.x + (leftPoint.x - rightPoint.x) * percent,
      y: rightPoint.y + (leftPoint.y - rightPoint.y) * percent
    };
  };

  const getQualitySliderPosition = () => {
    const percent = quality / 100;
    return {
      x: leftPoint.x + (topPoint.x - leftPoint.x) * percent,
      y: leftPoint.y + (topPoint.y - leftPoint.y) * percent
    };
  };

  // Handle slider dragging
  const handleMouseDown = (side) => {
    // Don't allow dragging if the side is locked
    if (side === lockedSide) return;
    
    setIsDragging(true);
    setActiveSide(side);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveSide(null);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !activeSide) return;
    
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    if (activeSide === 'scope') {
      // Calculate distance along scope side (top to right)
      const totalLength = Math.sqrt(
        Math.pow(rightPoint.x - topPoint.x, 2) + 
        Math.pow(rightPoint.y - topPoint.y, 2)
      );
      
      // Project mouse position onto the scope line
      const dx = rightPoint.x - topPoint.x;
      const dy = rightPoint.y - topPoint.y;
      const t = ((mouseX - topPoint.x) * dx + (mouseY - topPoint.y) * dy) / 
                (dx * dx + dy * dy);
      
      const projX = topPoint.x + t * dx;
      const projY = topPoint.y + t * dy;
      
      // Calculate percentage
      const currentLength = Math.sqrt(
        Math.pow(projX - topPoint.x, 2) + 
        Math.pow(projY - topPoint.y, 2)
      );
      
      let newValue = (currentLength / totalLength) * 100;
      newValue = Math.max(10, Math.min(90, newValue));
      setScope(newValue);
    } 
    else if (activeSide === 'time') {
      // Calculate distance along time side (right to left)
      const totalLength = Math.sqrt(
        Math.pow(leftPoint.x - rightPoint.x, 2) + 
        Math.pow(leftPoint.y - rightPoint.y, 2)
      );
      
      // Project mouse position onto the time line
      const dx = leftPoint.x - rightPoint.x;
      const dy = leftPoint.y - rightPoint.y;
      const t = ((mouseX - rightPoint.x) * dx + (mouseY - rightPoint.y) * dy) / 
                (dx * dx + dy * dy);
      
      const projX = rightPoint.x + t * dx;
      const projY = rightPoint.y + t * dy;
      
      // Calculate percentage
      const currentLength = Math.sqrt(
        Math.pow(projX - rightPoint.x, 2) + 
        Math.pow(projY - rightPoint.y, 2)
      );
      
      let newValue = (currentLength / totalLength) * 100;
      newValue = Math.max(10, Math.min(90, newValue));
      setTime(newValue);
    } 
    else if (activeSide === 'quality') {
      // Calculate distance along quality side (left to top)
      const totalLength = Math.sqrt(
        Math.pow(topPoint.x - leftPoint.x, 2) + 
        Math.pow(topPoint.y - leftPoint.y, 2)
      );
      
      // Project mouse position onto the quality line
      const dx = topPoint.x - leftPoint.x;
      const dy = topPoint.y - leftPoint.y;
      const t = ((mouseX - leftPoint.x) * dx + (mouseY - leftPoint.y) * dy) / 
                (dx * dx + dy * dy);
      
      const projX = leftPoint.x + t * dx;
      const projY = leftPoint.y + t * dy;
      
      // Calculate percentage
      const currentLength = Math.sqrt(
        Math.pow(projX - leftPoint.x, 2) + 
        Math.pow(projY - leftPoint.y, 2)
      );
      
      let newValue = (currentLength / totalLength) * 100;
      newValue = Math.max(10, Math.min(90, newValue));
      setQuality(newValue);
    }
  };

  // Calculate positions for sliders
  const scopeSliderPos = getScopeSliderPosition();
  const timeSliderPos = getTimeSliderPosition();
  const qualitySliderPos = getQualitySliderPosition();

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-6">Project Management Triangle</h2>
      <p className="mb-4 text-center">Drag any slider to adjust values. When one value changes, the other two will adjust accordingly.</p>
      
      <div className="relative mb-8">
        <svg 
          width={triangleSize} 
          height={triangleSize} 
          className="cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Draw the triangle */}
          <polygon 
            points={`${topPoint.x},${topPoint.y} ${rightPoint.x},${rightPoint.y} ${leftPoint.x},${leftPoint.y}`} 
            fill="none" 
            stroke="#ccc" 
            strokeWidth="2" 
          />
          
          {/* Draw side labels */}
          <text x={centerX} y={topPoint.y - 15} textAnchor="middle" className="font-bold">Quality</text>
          <text x={rightPoint.x + 15} y={rightPoint.y} textAnchor="start" className="font-bold">Scope</text>
          <text x={leftPoint.x - 15} y={leftPoint.y} textAnchor="end" className="font-bold">Time</text>
          
          {/* Draw the sliders with lock indicators */}
          <circle 
            cx={scopeSliderPos.x} 
            cy={scopeSliderPos.y} 
            r="8" 
            fill={activeSide === 'scope' ? "#3b82f6" : "#93c5fd"}
            stroke={lockedSide === 'scope' ? "#000" : "#3b82f6"}
            strokeWidth={lockedSide === 'scope' ? "3" : "2"}
            style={{cursor: lockedSide === 'scope' ? 'not-allowed' : 'pointer'}}
            onMouseDown={() => handleMouseDown('scope')}
          />
          {lockedSide === 'scope' && (
            <circle 
              cx={scopeSliderPos.x} 
              cy={scopeSliderPos.y} 
              r="3" 
              fill="#000" 
            />
          )}
          
          <circle 
            cx={timeSliderPos.x} 
            cy={timeSliderPos.y} 
            r="8" 
            fill={activeSide === 'time' ? "#f97316" : "#fdba74"}
            stroke={lockedSide === 'time' ? "#000" : "#f97316"}
            strokeWidth={lockedSide === 'time' ? "3" : "2"}
            style={{cursor: lockedSide === 'time' ? 'not-allowed' : 'pointer'}}
            onMouseDown={() => handleMouseDown('time')}
          />
          {lockedSide === 'time' && (
            <circle 
              cx={timeSliderPos.x} 
              cy={timeSliderPos.y} 
              r="3" 
              fill="#000" 
            />
          )}
          
          <circle 
            cx={qualitySliderPos.x} 
            cy={qualitySliderPos.y} 
            r="8" 
            fill={activeSide === 'quality' ? "#10b981" : "#6ee7b7"}
            stroke={lockedSide === 'quality' ? "#000" : "#10b981"}
            strokeWidth={lockedSide === 'quality' ? "3" : "2"}
            style={{cursor: lockedSide === 'quality' ? 'not-allowed' : 'pointer'}}
            onMouseDown={() => handleMouseDown('quality')}
          />
          {lockedSide === 'quality' && (
            <circle 
              cx={qualitySliderPos.x} 
              cy={qualitySliderPos.y} 
              r="3" 
              fill="#000" 
            />
          )}
        </svg>
      </div>
      
      {/* Display the current values with lock buttons */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-bold text-blue-700">Scope</h3>
            <button 
              onClick={() => toggleLock('scope')} 
              className="p-1 rounded-full hover:bg-blue-200"
              title={lockedSide === 'scope' ? "Unlock Scope" : "Lock Scope"}
            >
              {lockedSide === 'scope' ? 
                <Lock size={16} className="text-blue-700" /> : 
                <Unlock size={16} className="text-blue-700" />
              }
            </button>
          </div>
          <p className="text-2xl">{scope.toFixed(0)}%</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-bold text-orange-700">Time</h3>
            <button 
              onClick={() => toggleLock('time')} 
              className="p-1 rounded-full hover:bg-orange-200"
              title={lockedSide === 'time' ? "Unlock Time" : "Lock Time"}
            >
              {lockedSide === 'time' ? 
                <Lock size={16} className="text-orange-700" /> : 
                <Unlock size={16} className="text-orange-700" />
              }
            </button>
          </div>
          <p className="text-2xl">{time.toFixed(0)}%</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-bold text-green-700">Quality</h3>
            <button 
              onClick={() => toggleLock('quality')} 
              className="p-1 rounded-full hover:bg-green-200"
              title={lockedSide === 'quality' ? "Unlock Quality" : "Lock Quality"}
            >
              {lockedSide === 'quality' ? 
                <Lock size={16} className="text-green-700" /> : 
                <Unlock size={16} className="text-green-700" />
              }
            </button>
          </div>
          <p className="text-2xl">{quality.toFixed(0)}%</p>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-100 p-4 rounded-lg max-w-md">
        <h3 className="font-bold mb-2">Project Triangle Principle:</h3>
        <p>When you adjust one constraint (Scope, Time, or Quality), the other two must change to compensate. This illustrates that you cannot optimize all three simultaneously in project management.</p>
        <div className="mt-2 p-2 bg-yellow-100 rounded">
          <p className="text-sm"><strong>New feature:</strong> You can now lock any side using the lock/unlock button. When a side is locked, its value will remain fixed while the other two sides adjust.</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTriangle;