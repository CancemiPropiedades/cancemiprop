//import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../Css/CarouselCard.css';
import imgCard from '../Imagenes/inicio.png';

import { Pagination, Navigation } from 'swiper/modules';

function CarouselCard() {
  return (
    <>
      <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={imgCard} alt="Imagen de inicio" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imgCard} alt="Imagen de inicio" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imgCard} alt="Imagen de inicio" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imgCard} alt="Imagen de inicio" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={imgCard} alt="Imagen de inicio" className="carousel-image" />
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default CarouselCard;