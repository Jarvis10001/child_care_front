import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import "swiper/css/navigation";
// import physicaltherapy from "../../assets/physicaltherapy.jpg";

const services = [
  {
    title: "Clinical Psychology",
    image: "/path-to-image1.jpg",
  },
  {
    title: "Occupational Therapy",
    image: "/path-to-image2.jpg",
  },
  {
    title: "Speech Therapy",
    image: "/path-to-image3.jpg",
  },
  {
    title: "Physical Therapy",
    // image: physicaltherapy,
  },
  {
    title: "Behavioral Therapy",
    image: "/path-to-image5.jpg",
  },
  {
    title: "Cognitive Therapy",
    image: "/path-to-image6.jpg",
  },
];

const Focus = () => {
  return (
    <div className="text-center py-10">
      <h2 className="text-3xl font-bold mb-6">Our Focus Area</h2>
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        pagination={{ clickable: true }}
        className="px-6 pb-16"
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="swiper-pagination !relative !mt-8"></div>
      <button className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-yellow-600 transition-all">
        View All Services
      </button>
    </div>
  );
};

export default Focus;
