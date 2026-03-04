import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface CarouselItem {
  id: number;
  image_path: string;
  location_text?: string;
  link?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  if (!items.length) return null;

  return (
    <div className="carousel">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
        >
          <img src={item.image_path} alt={item.location_text || ''} />
          {item.location_text && (
            <div className="carousel-location">
              <FaMapMarkerAlt /> {item.location_text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Carousel;