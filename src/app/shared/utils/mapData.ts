import { ExerciseItem } from '../../core/models/exercise.model';
import { CardExcercise } from '../components/fxdonad-shared/card-excercise/card-excercise.component';

export function mapExerciseResToCardUI(exercise: ExerciseItem): CardExcercise {
  return {
    title: exercise.title,
    description: exercise.description,
    uploader: {
      name: 'Chưa rõ',
      avatar: '',
    },
    uploadTime: exercise.createdAt,
    difficulty: 'easy',
    tags: exercise.tags,
    status: 'completed',
    approval: 'accepted',
    type: exercise.exerciseType,
  };
}
