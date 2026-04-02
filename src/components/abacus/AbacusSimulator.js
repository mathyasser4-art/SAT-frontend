import React, { useState, useEffect, useRef } from 'react';
import './abacussimulator.css';

const createInitialState = () => Array(5).fill({
  topBeadActive: false,
  bottomBeadsActive: [false, false, false, false],
});

const AbacusSimulator = ({ onClose }) => {
  const [rods, setRods] = useState(createInitialState());
  const [totalValue, setTotalValue] = useState(0);
  
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const popupRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (popupRef.current) {
      const { offsetWidth, offsetHeight } = popupRef.current;
      setPosition({
        x: (window.innerWidth - offsetWidth) / 2,
        y: (window.innerHeight - offsetHeight) / 2,
      });
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const { left, top } = popupRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    offsetRef.current = { x: clientX - left, y: clientY - top };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    setPosition({
      x: clientX - offsetRef.current.x,
      y: clientY - offsetRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);
  
  useEffect(() => {
    let total = 0;
    rods.forEach((rod, i) => {
      let rodValue = 0;
      if (rod.topBeadActive) rodValue += 5;
      rodValue += rod.bottomBeadsActive.filter(isActive => isActive).length;
      total += rodValue * Math.pow(10, rods.length - 1 - i);
    });
    setTotalValue(total);
  }, [rods]);
  
  const handleTopBeadClick = (rodIndex) => {
    const newRods = JSON.parse(JSON.stringify(rods));
    newRods[rodIndex].topBeadActive = !newRods[rodIndex].topBeadActive;
    setRods(newRods);
  };

  const handleBottomBeadClick = (rodIndex, beadIndex) => {
    const newRods = JSON.parse(JSON.stringify(rods));
    const isClickedBeadActive = newRods[rodIndex].bottomBeadsActive[beadIndex];
    for (let i = 0; i < 4; i++) {
      if (isClickedBeadActive) {
        if (i >= beadIndex) newRods[rodIndex].bottomBeadsActive[i] = false;
      } else {
        if (i <= beadIndex) newRods[rodIndex].bottomBeadsActive[i] = true;
      }
    }
    setRods(newRods);
  };
  
  const handleReset = () => {
    setRods(createInitialState());
  };

  return (
    <div
      className="abacus-popup-wrapper"
      ref={popupRef}
      style={{
        visibility: position ? 'visible' : 'hidden', 
        top: position ? `${position.y}px` : 0,
        left: position ? `${position.x}px` : 0,
      }}
    >
      <button 
        className="abacus-close-button"
        onClick={onClose}
        title="Close Abacus"
      >
        ×
      </button>
      
      <div 
        className="abacus-drag-handle" 
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        Drag Abacus
      </div>
      
      <div className="abacus-widget-container">
        <div id="abacus">
          {rods.map((rod, rodIndex) => (
            <div key={rodIndex} className="rod">
              <div
                className={`top-bead ${rod.topBeadActive ? 'active' : ''}`}
                onClick={() => handleTopBeadClick(rodIndex)}
              ></div>
              <div className="divider"></div>
              {rod.bottomBeadsActive.map((isActive, beadIndex) => (
                <div
                  key={beadIndex}
                  className={`bottom-bead ${isActive ? 'active' : ''}`}
                  onClick={() => handleBottomBeadClick(rodIndex, beadIndex)}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <h2>Value: <span id="output">{totalValue}</span></h2>
        <button id="resetBtn" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default AbacusSimulator;