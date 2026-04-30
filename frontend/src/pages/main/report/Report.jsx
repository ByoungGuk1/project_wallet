import { useEffect, useState } from "react";
import S from "./style";
import CalendarContainer from "./calendar/CalendarContainer";

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
      categories.find(
        (category) =>
          Array.isArray(category.history) && category.history.length > 0,
      ) || categories[0];

    setSelectedCategory(defaultCategory);
  }, [data]);

  useEffect(() => {
    if (!selectedCategory) return;

    const nextGroups = Array.isArray(selectedCategory.history)
      ? selectedCategory.history
      : [];

    setSelectedGroup(nextGroups[0] || null);
  }, [selectedCategory]);

  function categoryList() {
    return categories.map((category) => {
      const isSelected = category.name === selectedCategory?.name;
      const hasGroups =
        Array.isArray(category.history) && category.history.length > 0;

      return (
        <S.CategoryButton
          key={category.name}
          type="button"
          onClick={() => setSelectedCategory(category)}
          $selected={isSelected}
          $disabled={!hasGroups}
          aria-pressed={isSelected}
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

    return groups.map((group) => (
      <S.GroupButton
        key={group.name}
        type="button"
        onClick={() => setSelectedGroup(group)}
        $selected={group.name === selectedGroup?.name}
      >
        {group.name}
      </S.GroupButton>
    ));
  }

  return (
    <S.ReportWrapper>
      <S.CalendarSection>
        <CalendarContainer
          groupName={selectedGroup?.name}
          calendar={calendar}
        />
      </S.CalendarSection>

      <S.GroupSection>
        <S.CategoryList>
          <S.CategoryTabs>{categoryList()}</S.CategoryTabs>
          <S.SettingButton type="button">설정</S.SettingButton>
        </S.CategoryList>

        <S.GroupList>{groupList()}</S.GroupList>
      </S.GroupSection>
    </S.ReportWrapper>
  );
};

export default Report;
