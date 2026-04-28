import { useEffect, useState } from "react";
import S from "./style";

const Report = ({ data = [] }) => {
  const categories = Array.isArray(data) ? data : [];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const groups = Array.isArray(selectedCategory?.history)
    ? selectedCategory.history
    : [];
  const calendar = Array.isArray(selectedGroup?.calendar)
    ? selectedGroup.calendar
    : [];

  useEffect(() => {
    if (categories.length === 0) return;
    const defaultCategory =
      categories.find((category) => Array.isArray(category.history)) ||
      categories[0];
    setSelectedCategory(defaultCategory);
  }, [data]);

  useEffect(() => {
    if (!selectedCategory) return;
    const nextGroups = Array.isArray(selectedCategory.history)
      ? selectedCategory.history
      : [];
    setSelectedGroup(nextGroups[0] || null);
  }, [selectedCategory]);

  const renderCalendar = () => {
    if (calendar.length === 0) {
      return <S.NoData>표시할 거래 내역이 없습니다.</S.NoData>;
    }

    return calendar.map((item) => (
      <div key={item.date}>
        <strong>{item.date}</strong>
        <p>수입: {item.income}원</p>
        <p>지출: {item.expenses}원</p>
      </div>
    ));
  };

  function categoryList() {
    return categories.map((category) => {
      return (
        <S.CategoryButton
          key={category.name}
          type="button"
          onClick={() => setSelectedCategory(category)}
          $selected={category.name === selectedCategory?.name}
        >
          {category.name}
        </S.CategoryButton>
      );
    });
  }

  function groupList() {
    if (groups.length === 0) {
      return <S.NoData>등록된 그룹이 없습니다.</S.NoData>;
    }

    return groups.map((group) => {
      return (
        <S.GroupButton
          key={group.name}
          type="button"
          onClick={() => setSelectedGroup(group)}
          $selected={group.name === selectedGroup?.name}
        >
          {group.name}
        </S.GroupButton>
      );
    });
  }
  return (
    <S.ReportWrapper>
      <S.CalendarSection>{renderCalendar()}</S.CalendarSection>
      <S.GroupSection>
        <S.CategoryList>
          {categoryList()}
          <S.SettingButton>설정</S.SettingButton>
        </S.CategoryList>
        <S.GroupList>{groupList()}</S.GroupList>
      </S.GroupSection>
    </S.ReportWrapper>
  );
};

export default Report;
