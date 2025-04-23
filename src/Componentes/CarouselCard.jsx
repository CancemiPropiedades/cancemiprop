import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../Css/CarouselCard.css';
import { Pagination, Navigation } from 'swiper/modules';

const getFullImageUrl = (path) => `https://cancemi-inmobiliaria-backend-admin.vercel.app/uploads/${path}`;

function CarouselCard({ images }) {
  if (!images || images.length === 0) {
    return <div className="carousel-placeholder">No hay imágenes disponibles</div>;
  }

  return (
    <Swiper
      pagination={{ type: 'fraction' }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
    >
      {images.map((image, index) => {
        return (
          <SwiperSlide key={index}>
            <img src={getFullImageUrl(image)} alt={`Slide ${index + 1}`} className="carousel-imageC" />
          </SwiperSlide>
        );
      })}

    </Swiper>
  );
}

export default CarouselCard;