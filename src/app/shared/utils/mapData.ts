import { ExerciseCodeResponse } from '../../core/models/code.model';
import {
  CreateExerciseRequest,
  ExerciseItem,
  ExerciseQuiz,
} from '../../core/models/exercise.model';
import { PostADD, Post } from '../../core/models/post.models';
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

export function mapPostInfortoPost(post: PostADD): Post {
  return {
    id: '',
    userId: post.orgId,
    orgId: post.orgId,
    title: post.title,
    content: post.content, // markdown format
    tags: post.hashtag,
    field: post.oldImagesUrls, // list of URLs to images, documents, videos, etc.
    metrics: {
      view: 0,
      up: 0,
      down: 0,
      commentCount: 0,
    },
    status: post.status,
  };
}

export function mapToExerciseQuiz(ex: ExerciseCodeResponse): ExerciseQuiz {
  return {
    id: ex.id,
    userId: ex.userId,
    title: ex.title,
    description: ex.description,
    exerciseType: ex.exerciseType, // hoặc gán cứng 'QUIZ' nếu bạn muốn
    difficulty: ex.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
    orgId: ex.orgId,
    active: ex.active,
    cost: ex.cost,
    freeForOrg: ex.freeForOrg,
    visibility: ex.visibility,
    startTime: ex.startTime,
    endTime: ex.endTime,
    duration: ex.duration,
    allowDiscussionId: ex.allowDiscussionId,
    resourceIds: ex.resourceIds,
    tags: ex.tags,
    allowAiQuestion: ex.allowAiQuestion,
    quizDetail: null, // bỏ qua, không map
    createdBy: '', // nếu response không có thì để rỗng
    createdAt: '',
    updatedBy: '',
    updatedAt: '',
    deletedBy: '',
    deletedAt: '',
  };
}
