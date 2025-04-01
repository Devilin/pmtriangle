import React, { useState, useEffect } from 'react';
// Note: We're removing the Lucide React import and will use text instead of icons
// import { Lock, Unlock, RefreshCw } from 'lucide-react';

const ProjectTriangle = () => {
  const [scope, setScope] = useState(50);
  const [time, setTime] = useState(50);
  const [quality, setQuality] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSide, setActiveSide] = useState(null);
  const [lockedSide, setLockedSide] = useState(null);
  const [strategy, setStrategy] = useState("");
  const [gifUrl, setGifUrl] = useState("/api/placeholder/300/200");
  
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

  // Function to update strategy based on current values
  const updateStrategy = () => {
    // Define thresholds
    const high = 70;
    const low = 30;
    
    // Generate strategy description based on current values and locks
    let newStrategy = "";
    let newGifUrl = "";
    
    if (lockedSide === 'scope' && scope > high) {
      newStrategy = "Focused on large scope with fixed features. Balancing time and quality to deliver comprehensive solution.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "ambitious project" gif
    } else if (lockedSide === 'scope' && scope < low) {
      newStrategy = "Minimalist MVP approach with tightly controlled scope. Adjusting time and quality for efficient delivery.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "minimalist project" gif
    } else if (lockedSide === 'time' && time > high) {
      newStrategy = "Long-term approach with fixed timeline. Balancing scope and quality for sustainable development.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "long term project" gif
    } else if (lockedSide === 'time' && time < low) {
      newStrategy = "Rapid delivery with tight deadline. Carefully managing scope and quality for quick implementation.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "fast project" gif
    } else if (lockedSide === 'quality' && quality > high) {
      newStrategy = "Premium quality standard is non-negotiable. Adjusting scope and timeline to ensure excellence.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "high quality" gif
    } else if (lockedSide === 'quality' && quality < low) {
      newStrategy = "Prototype-level quality focusing on experimentation. Balancing scope and time for learning.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "prototype" gif
    } else if (scope > high && time > high) {
      newStrategy = "Ambitious approach with large scope and generous timeline, likely at expense of some quality.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "big project" gif
    } else if (scope > high && quality > high) {
      newStrategy = "Premium product with comprehensive features, requiring significant time investment.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "premium product" gif
    } else if (time > high && quality > high) {
      newStrategy = "Craftsmanship approach with focus on excellence and patience, limiting overall scope.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "craftsman" gif
    } else if (scope < low && time < low) {
      newStrategy = "Quick-win approach with minimal features delivered rapidly, accepting quality tradeoffs.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "quick win" gif
    } else if (scope < low && quality < low) {
      newStrategy = "Proof-of-concept focused on essential functionality with minimal refinement.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "proof of concept" gif
    } else if (time < low && quality < low) {
      newStrategy = "Urgent delivery prioritizing speed over refinement, focusing on core functionality.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "urgent delivery" gif
    } else {
      newStrategy = "Balanced approach with moderate scope, timeline, and quality expectations.";
      newGifUrl = "/api/placeholder/300/200"; // Placeholder for "balanced" gif
    }
    
    setStrategy(newStrategy);
    setGifUrl(newGifUrl);
  };
  
  // Initialize strategy on first render
  useEffect(() => {
    updateStrategy();
  }, []);

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

  // Inline styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px'
  };

  const paragraphStyle = {
    marginBottom: '16px',
    textAlign: 'center'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    width: '100%',
    maxWidth: '500px'
  };

  const boxStyle = (color) => ({
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundColor: color
  });

  const flexCenterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '4px'
  };

  const headerStyle = {
    fontWeight: 'bold'
  };

  const valueStyle = {
    fontSize: '24px'
  };

  const buttonStyle = {
    padding: '4px',
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none'
  };

  const strategyContainerStyle = {
    marginTop: '32px',
    backgroundColor: '#f3f4f6',
    padding: '16px',
    borderRadius: '8px',
    maxWidth: '500px'
  };

  const strategyHeaderContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  };

  const updateButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer'
  };

  const strategyTextStyle = {
    marginBottom: '12px'
  };

  const gifContainerStyle = {
    display: 'flex',
    justifyContent: 'center'
  };

  const gifStyle = {
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    marginTop: '8px',
    marginBottom: '8px'
  };

  const helperTextStyle = {
    fontSize: '14px',
    color: '#4b5563',
    marginTop: '8px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Project Management Triangle Tool</h1>
      <p style={paragraphStyle}>
        The Project Management Triangle (also called the Iron Triangle or Triple Constraint) illustrates the balance between 
        Scope, Time, and Quality in project management. Adjust any constraint to see how it affects the others.
      </p>
      <p style={paragraphStyle}>Drag any slider to adjust values. When one value changes, the other two will adjust accordingly.</p>
      
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <svg 
          width={triangleSize} 
          height={triangleSize} 
          style={{ cursor: 'pointer' }}
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
          <text x={centerX} y={topPoint.y - 15} textAnchor="middle" fontWeight="bold">Quality</text>
          <text x={rightPoint.x + 15} y={rightPoint.y} textAnchor="start" fontWeight="bold">Scope</text>
          <text x={leftPoint.x - 15} y={leftPoint.y} textAnchor="end" fontWeight="bold">Time</text>
          
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
      <div style={gridStyle}>
        <div style={boxStyle('#dbeafe')}>
          <div style={flexCenterStyle}>
            <h3 style={{...headerStyle, color: '#1e40af'}}>Scope</h3>
            <button 
              onClick={() => toggleLock('scope')} 
              style={buttonStyle}
              title={lockedSide === 'scope' ? "Unlock Scope" : "Lock Scope"}
            >
              {lockedSide === 'scope' ? '🔒' : '🔓'}
            </button>
          </div>
          <p style={valueStyle}>{scope.toFixed(0)}%</p>
        </div>
        <div style={boxStyle('#ffedd5')}>
          <div style={flexCenterStyle}>
            <h3 style={{...headerStyle, color: '#c2410c'}}>Time</h3>
            <button 
              onClick={() => toggleLock('time')} 
              style={buttonStyle}
              title={lockedSide === 'time' ? "Unlock Time" : "Lock Time"}
            >
              {lockedSide === 'time' ? '🔒' : '🔓'}
            </button>
          </div>
          <p style={valueStyle}>{time.toFixed(0)}%</p>
        </div>
        <div style={boxStyle('#d1fae5')}>
          <div style={flexCenterStyle}>
            <h3 style={{...headerStyle, color: '#047857'}}>Quality</h3>
            <button 
              onClick={() => toggleLock('quality')} 
              style={buttonStyle}
              title={lockedSide === 'quality' ? "Unlock Quality" : "Lock Quality"}
            >
              {lockedSide === 'quality' ? '🔒' : '🔓'}
            </button>
          </div>
          <p style={valueStyle}>{quality.toFixed(0)}%</p>
        </div>
      </div>
      
      <div style={strategyContainerStyle}>
        <div style={strategyHeaderContainerStyle}>
          <h3 style={headerStyle}>Your Strategy:</h3>
          <button 
            onClick={updateStrategy}
            style={updateButtonStyle}
            title="Update strategy based on current values"
          >
            🔄 Update
          </button>
        </div>
        
        <p style={strategyTextStyle}>{strategy}</p>
        <div style={gifContainerStyle}>
          <img 
            src={gifUrl} 
            alt="Project strategy illustration" 
            style={gifStyle}
            width="300"
            height="200"
          />
        </div>
        <p style={helperTextStyle}>
          Adjust the triangle sliders or lock constraints and click "Update" to see your new strategy.
        </p>
      </div>
    </div>
  );
};

export default ProjectTriangle;