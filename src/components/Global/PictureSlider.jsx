import React from "react";
import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";

const PictureSlider = ({ images }) => {
  return (
    <div>
      <Carousel
        withIndicators
        height="auto"
        slideSize="50.55%"
        slideGap="md"
        loop
        align="center"
        maxWidth="100%"
        breakpoints={[
          { maxWidth: "md", slideSize: "50%" },
          { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
        ]}
      >
        {images?.map((slide) => (
          <Carousel.Slide>
            <Image src={slide?.img} alt={slide?.img} srcset="" />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};

export default PictureSlider;
