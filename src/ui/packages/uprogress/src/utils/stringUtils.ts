import { DisciplineType } from '@ui/app-shell';

export const getType = (key: DisciplineType) => {
  switch (key) {
    case DisciplineType.Exam:
      return 'Экзамен';
    case DisciplineType.Free:
      return 'Без итоговой отметки';
    case DisciplineType.Mark:
      return 'Дифференцированный зачет';
    case DisciplineType.NoMark:
      return 'Зачет';
    case DisciplineType.Project:
      return 'Курсовой проект';
    default:
      return '';
  }
};
