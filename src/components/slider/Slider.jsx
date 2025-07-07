import React, { useState, useEffect, useRef } from 'react';
import 'tailwindcss/tailwind.css';

const Slider = () => {
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = [
    {
      id: 1,
      title: 'Modern Architecture',
      description: 'Exploring the intersection of form and function in contemporary design.',
      imgSrc: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
      label: '01 / VISION',
    },
    {
      id: 2,
      title: 'Urban Spaces',
      description: 'Creating environments that inspire and transform daily life.',
      imgSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      label: '02 / DESIGN',
    },
    {
      id: 3,
      title: 'Interior Flow',
      description: 'Harmonizing space and light to create immersive experiences.',
      imgSrc: 'https://images.unsplash.com/photo-1682687220067-dced0a5865c5',
      label: '03 / SPACE',
    },
  ];

  const scrollToSection = (index) => {
    if (!isScrolling) {
      setIsScrolling(true);
      containerRef.current.children[index].scrollIntoView({ behavior: 'smooth' });
      setActiveIndex(index);
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      setActiveIndex(index);
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-neutral-950 text-white overflow-hidden">
      <div ref={containerRef} className="scroll-container h-screen overflow-y-auto overflow-x-hidden">
        {sections.map((section, index) => (
          <section key={section.id} className="scroll-section relative h-screen flex flex-col md:flex-row">
            <div className={`w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden group shine-effect ${index % 2 === 0 ? 'order-1 md:order-2' : ''}`}>
              <img src={section.imgSrc} alt={section.title} className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 to-neutral-950/50 transition-opacity duration-500 group-hover:opacity-0"></div>
            </div>
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8 bg-neutral-950">
              <div className="max-w-lg float-animation">
                <span className="text-neutral-400 tracking-wider text-sm font-mono">{section.label}</span>
                <h2 className="mt-4 text-5xl md:text-7xl font-bold leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">{section.title}</h2>
                <p className="mt-6 text-neutral-400 text-lg leading-relaxed">{section.description}</p>
                <button className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-all duration-300 hover:tracking-wider">Explore More →</button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-white scale-150' : 'bg-white/20 hover:bg-white hover:scale-150'}`}
            title={`Go to section ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;