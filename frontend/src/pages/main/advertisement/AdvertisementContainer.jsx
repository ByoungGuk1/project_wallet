import S from "./style";
import { useEffect, useMemo, useState } from "react";
import defaultAdImage from "../../../assets/images/main-ad.png";

const DEFAULT_ADS = [
  {
    id: 0,
    title: "기본 광고 이미지",
    imgUrl: defaultAdImage,
    linkUrl: "/",
  },
];

const AdvertisementContainer = ({ adList = [] }) => {
  const ads = useMemo(() => {
    return adList.length > 0 ? adList : DEFAULT_ADS;
  }, [adList]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentAd = ads[currentIndex];

  const movePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? ads.length - 1 : prevIndex - 1,
    );
  };

  const moveNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === ads.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const moveToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (ads.length <= 1) return;

    const timerId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === ads.length - 1 ? 0 : prevIndex + 1,
      );
    }, 10000);

    return () => clearInterval(timerId);
  }, [ads]);

  return (
    <S.AdWrapper>
      <S.ImageWrapper to={currentAd.linkUrl}>
        <S.AdImage src={currentAd.imgUrl} alt={currentAd.title}></S.AdImage>
      </S.ImageWrapper>
      {ads.length > 1 && (
        <>
          <S.PrevButton type="button" onClick={movePrev}>
            ‹
          </S.PrevButton>

          <S.NextButton type="button" onClick={moveNext}>
            ›
          </S.NextButton>

          <S.IndicatorWrapper>
            {ads.map((ad, index) => (
              <S.IndicatorButton
                key={ad.id}
                type="button"
                $active={index === currentIndex}
                onClick={() => moveToSlide(index)}
                aria-label={`${index + 1}번째 광고 보기`}
              />
            ))}
          </S.IndicatorWrapper>
        </>
      )}
    </S.AdWrapper>
  );
};

export default AdvertisementContainer;
