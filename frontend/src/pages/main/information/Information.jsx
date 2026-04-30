import { useEffect, useState } from "react";
import S from "./style";

const Information = ({ informations = [] }) => {
  const [selectedInformation, setSelectedInformation] = useState(null);
  useEffect(() => {
    if (informations.length === 0) return;
    const randomIndex = Math.floor(Math.random() * informations.length);
    setSelectedInformation(informations[randomIndex]);
  }, [informations]);

  if (!selectedInformation) {
    return null;
  }

  return (
    <S.InformationWrapper>
      <S.InformationCard>
        <S.InformationTextWrapper>
          <S.InformationTitle to={`/informations/${selectedInformation.id}`}>
            {selectedInformation.title}
          </S.InformationTitle>
          <S.InformationDescription>
            {selectedInformation.description}
          </S.InformationDescription>
        </S.InformationTextWrapper>
        <S.InformationImgWrapper>
          {selectedInformation.img}
        </S.InformationImgWrapper>
      </S.InformationCard>
    </S.InformationWrapper>
  );
};

export default Information;
