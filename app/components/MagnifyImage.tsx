// MagnifyImage.tsx
import React, { useState, useRef, useEffect } from "react";

interface MagnifyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const MagnifyImage: React.FC<MagnifyImageProps> = ({
  src,
  alt,
  width,
  height,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      setSize([imageRef.current.offsetWidth, imageRef.current.offsetHeight]);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = imageRef.current;
    const { top, left } = elem!.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setXY([x, y]);
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className="relative" style={{ width, height }}>
      <div
        ref={imageRef}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {showMagnifier && (
          <div
            style={{
              position: "absolute",
              // Lens size: 50x50 pixels
              left: `${x - 25}px`,
              top: `${y - 25}px`,
              width: "25px",
              height: "25px",
              border: "1px solid #00b050",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            // Position adjustment
            left: `${-width * 2}px`,
            top: "0",
            pointerEvents: "none",
            // Magnifier size: 1.5 times the original image
            width: width * 2,
            height: height * 2,
            border: "1px solid lightgray",
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            // Zoom level: 3x
            backgroundSize: `${imgWidth * 3}px ${imgHeight * 3}px`,
            // Adjust background position based on mouse coordinates
            backgroundPositionX: `${-x * 3 + width * 0.75}px`,
            backgroundPositionY: `${-y * 3 + height * 0.75}px`,
          }}
        />
      )}
    </div>
  );
};

export default MagnifyImage;
