import { Image } from 'antd';
import React from 'react';
import Slider from 'react-slick/lib/slider';

const SliderComponents = ({ arrImage }) => {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    return (
        <Slider {...settings}>
            {arrImage.map((image) => {
                return (
                    <Image
                        key={image}
                        src={image}
                        alt="slider"
                        preview={false}
                        style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                        }}
                    />
                );
            })}
        </Slider>
    );
};

export default SliderComponents;
