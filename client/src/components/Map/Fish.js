import React, { useEffect, useRef, useState } from 'react';
import '../../Fish.css';

const Fish = () => {
  const [fishPositions, setFishPositions] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [mapRect, setMapRect] = useState(null);
  const animationRef = useRef(null);
  const fishCount = 5; // More fish!

  // Initialize fish in random positions
  useEffect(() => {
    // Find map container once on initial load
    const mapElement = document.querySelector('.leaflet-container');
    
    if (mapElement) {
      const mapBounds = mapElement.getBoundingClientRect();
      setMapRect({
        left: mapBounds.left,
        right: mapBounds.right,
        top: mapBounds.top,
        bottom: mapBounds.bottom,
        width: mapBounds.width,
        height: mapBounds.height
      });
    }
    
    const initialFish = [];
    for (let i = 0; i < fishCount; i++) {
      initialFish.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        directionX: (Math.random() - 0.5) * 0.5,
        directionY: (Math.random() - 0.5) * 0.5,
        speed: 0.3 + Math.random() * 0.5, // Slightly faster
        scale: 0.4 + Math.random() * 0.3, // Bigger fish
        flipped: Math.random() > 0.5,
        rotation: Math.random() * 10 - 5,
        fleeing: false, // Track if fish is fleeing from cursor
      });
    }
    
    setFishPositions(initialFish);
    
    // Set up mouse tracking
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      if (mapElement) {
        const newMapBounds = mapElement.getBoundingClientRect();
        setMapRect({
          left: newMapBounds.left,
          right: newMapBounds.right,
          top: newMapBounds.top,
          bottom: newMapBounds.bottom,
          width: newMapBounds.width,
          height: newMapBounds.height
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    // Skip if no fish or map rect
    if (fishPositions.length === 0) return;
    
    // Check if point is inside map
    const isInsideMap = (x, y) => {
      if (!mapRect) return false;
      
      return (
        x >= mapRect.left &&
        x <= mapRect.right &&
        y >= mapRect.top &&
        y <= mapRect.bottom
      );
    };
    
    // Check if mouse is inside map
    const isMouseInsideMap = () => {
      return isInsideMap(mousePosition.x, mousePosition.y);
    };
    
    const updateFishPositions = () => {
      setFishPositions(prevPositions => {
        return prevPositions.map(fish => {
          let newDirectionX = fish.directionX;
          let newDirectionY = fish.directionY;
          let fleeing = fish.fleeing;
          let fleeingSpeed = fish.speed * 1.8; // Faster when fleeing
          
          // Only interact with cursor if it's NOT in the map
          if (!isMouseInsideMap()) {
            const dx = fish.x - mousePosition.x;
            const dy = fish.y - mousePosition.y;
            const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
            
            // React to mouse when close (increased reaction distance)
            if (distanceToMouse < 150) {
              // Flee from cursor - stronger response
              fleeing = true;
              const fleeFactor = 0.15;
              newDirectionX = (dx / distanceToMouse) * fleeFactor;
              newDirectionY = (dy / distanceToMouse) * fleeFactor;
              
              // Add a bit of randomness to the fleeing to create dispersal
              newDirectionX += (Math.random() - 0.5) * 0.1;
              newDirectionY += (Math.random() - 0.5) * 0.1;
            } else {
              // Gradually calm down if no longer being chased
              if (fish.fleeing) {
                fleeing = Math.random() > 0.05 ? true : false;
              }
            }
          } else {
            // Gradually stop fleeing if mouse is in map
            if (fish.fleeing) {
              fleeing = Math.random() > 0.1 ? true : false;
            }
          }
          
          // Occasional random direction changes when not fleeing
          if (!fleeing && Math.random() < 0.01) {
            newDirectionX += (Math.random() - 0.5) * 0.2;
            newDirectionY += (Math.random() - 0.5) * 0.2;
          }
          
          // Normalize direction vector
          const length = Math.sqrt(newDirectionX * newDirectionX + newDirectionY * newDirectionY);
          if (length > 0.01) { // Prevent division by near-zero
            newDirectionX = newDirectionX / length;
            newDirectionY = newDirectionY / length;
          }
          
          // Calculate new position - faster when fleeing
          const currentSpeed = fleeing ? fleeingSpeed : fish.speed;
          let newX = fish.x + newDirectionX * currentSpeed;
          let newY = fish.y + newDirectionY * currentSpeed;
          
          // Wrap around screen edges with padding
          const padding = 80; // Larger to account for bigger fish
          if (newX < -padding) newX = window.innerWidth + padding/2;
          if (newX > window.innerWidth + padding/2) newX = -padding;
          if (newY < -padding) newY = window.innerHeight + padding/2;
          if (newY > window.innerHeight + padding/2) newY = -padding;
          
          // Update flip direction based on movement
          const flipped = newDirectionX < 0;
          
          // Calculate a smoother rotation based on direction
          const targetRotation = newDirectionY * 15; // Rotate up to 15 degrees
          let newRotation = fish.rotation * 0.8 + targetRotation * 0.2; // Smooth transition
          
          return {
            ...fish,
            x: newX,
            y: newY,
            directionX: newDirectionX,
            directionY: newDirectionY,
            flipped,
            rotation: newRotation,
            fleeing
          };
        });
      });
      
      animationRef.current = requestAnimationFrame(updateFishPositions);
    };
    
    animationRef.current = requestAnimationFrame(updateFishPositions);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [fishPositions, mousePosition, mapRect]);
  
  return (
    <div className="global-fish-container">
      {fishPositions.map(fish => (
        <div
          key={fish.id}
          className="swimming-fish"
          style={{
            left: `${fish.x}px`,
            top: `${fish.y}px`,
            transform: `scale(${fish.scale}) ${fish.flipped ? 'scaleX(-1)' : ''} rotate(${fish.rotation}deg)`,
            transition: fish.fleeing ? 'transform 0.1s ease' : 'transform 0.3s ease', // Quicker transitions when fleeing
            zIndex: 0 // Ensure fish stay behind other elements
          }}
        >
          <img src="/fishCartoon.png" alt="Swimming fish" />
        </div>
      ))}
    </div>
  );
};

export default Fish;