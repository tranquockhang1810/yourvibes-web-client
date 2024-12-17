import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import useColor from '@/hooks/useColor';
import { PostMediaModel } from '@/api/features/post/models/PostResponseModel';

interface MediaViewProps {
  mediaItems: PostMediaModel[];
}

const MediaView: React.FC<MediaViewProps> = React.memo(({ mediaItems }) => {
  const { brandPrimary, lightGray } = useColor();

  // Cấu hình slider cho react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots slick-thumb",
    customPaging: (i: number) => (
      <div
        style={{
          backgroundColor: i === 0 ? brandPrimary : lightGray,
          width: 10,
          height: 10,
          borderRadius: '50%',
          display: 'inline-block',
        }}
      />
    ),
  };

  return (
    <Slider {...settings}>
      {mediaItems?.map((media, index) => {
        const isVideo = media?.media_url?.endsWith('.mp4') || media?.media_url?.endsWith('.mov'); // Kiểm tra nếu là video
        return isVideo ? (
          <video
            key={index}
            style={{
              height: 250,
              width: '100%',
              objectFit: 'cover',
            }}
            src={media?.media_url || ""}
            controls
            loop
            muted
            autoPlay
          />
        ) : (
          <img
            key={index}
            src={media?.media_url || ""}
            alt={`media-${index}`}
            style={{
              height: 250,
              width: '100%',
              objectFit: 'cover',
            }}
          />
        );
      })}
    </Slider>
  );
});

export default MediaView;