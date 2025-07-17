import { ExerciseItem } from '../../core/models/exercise.model';
import { CardExcercise } from '../components/fxdonad-shared/card-excercise/card-excercise.component';

export function mapExerciseResToCardUI(exercise: ExerciseItem): CardExcercise {
  return {
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    uploader: {
      name: 'Ẩn danh',
      avatar: '',
    },
    uploadTime: exercise.createdAt,
    difficulty: exercise.difficulty,
    tags: exercise.tags,
    status: 'completed',
    approval: 'accepted',
    type: exercise.exerciseType,
  };
}
