import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../Css/CarouselDetails.css';
import { Pagination, Navigation } from 'swiper/modules';

const getFullImageUrl = (path) => `https://cancemi-inmobiliaria-backend-admin.vercel.app/uploads/${path}`;

function CarouselDetails({ images }) {

  return (
    <Swiper
      pagination={{ type: 'fraction' }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={getFullImageUrl(image)} alt={`Slide ${index + 1}`} className="carousel-image" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CarouselDetails;