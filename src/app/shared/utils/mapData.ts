import {
  CreateExerciseRequest,
  ExerciseItem,
} from '../../core/models/exercise.model';
import { CardExcercise } from '../components/fxdonad-shared/card-excercise/card-excercise.component';

const newDate = new Date();

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

export function mapCreateExerciseToCardUI(
  exercise: CreateExerciseRequest
): CardExcercise {
  return {
    id: '',
    title: exercise.title,
    description: exercise.description || '',
    uploader: {
      name: 'Ẩn danh',
      avatar: '',
    },
    uploadTime: newDate.toString(),
    difficulty: exercise.difficulty,
    tags: exercise.tags ? new Set(exercise.tags) : new Set<string>(),
    status: 'pending',
    approval: 'accepted',
    type: exercise.exerciseType,
  };
}
