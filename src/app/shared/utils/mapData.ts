import { avatarUrlDefault } from '../../core/constants/value.constant';
import { ExerciseCodeResponse } from '../../core/models/code.model';
import {
  CreateExerciseRequest,
  ExerciseItem,
  ExerciseQuiz,
} from '../../core/models/exercise.model';
import {
  PostADD,
  Post,
  postData,
  PostCardInfo,
  PostResponse,
} from '../../core/models/post.models';
import {
  ResourceData,
  resourceCardInfo,
} from '../../core/models/resource.model';
import { CardExcercise } from '../components/fxdonad-shared/card-excercise/card-excercise.component';

const newDate = new Date();

export function mapExerciseResToCardUI(exercise: ExerciseItem): CardExcercise {
  return {
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    uploader: {
      name: exercise.user?.displayName ?? 'Ẩn danh',
      avatar: exercise.user?.avatarUrl ?? avatarUrlDefault,
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
    tags: post.fileDocument?.tags || [],
    field: post.fileDocument?.tags || [], // list of URLs to images, documents, videos, etc.
    metrics: {
      view: 0,
      up: 0,
      down: 0,
      commentCount: 0,
    },
    status: post.status,
  };
}
export function mapPostdatatoPostCardInfo(post: PostResponse): PostCardInfo {
  return {
    id: post.postId,
    avatar: post.imagesUrls[1],
    author: post.user.displayName,
    title: post.title,
    time: post.createdAt,
    description: post.content,
    tags: [post.hashtag],
    comment: 0,
    upvote: 0,
    downvote: 0,
    status: post.status,
    public: post.isPublic,
  };
}
export function maptoReourseCard(resourse: ResourceData): resourceCardInfo {
  return {
    id: resourse.id,
    avatarAuthor:
      'https://i.pinimg.com/736x/8b/8e/ff/8b8eff070443cf6103c8279a28673809.jpg',
    authorId: resourse.id,
    authorName: 'author',
    duration: resourse.duration,
    progress: 5,
    title: resourse.fileName,
    thumnailurl: resourse.thumbnailUrl,
    time: new Date('22-02-2003'),
    description: resourse.description,
    tags: resourse.tags,
    status: resourse.transcodingStatus,
    public: true, //đang cứng cần sửa
  };
}
export function mapToResourceCardList(
  resources: ResourceData[]
): resourceCardInfo[] {
  return resources.map((resource) => ({
    id: resource.id,
    avatarAuthor:
      'https://i.pinimg.com/736x/8b/8e/ff/8b8eff070443cf6103c8279a28673809.jpg',
    authorId: resource.id,
    authorName: 'author',
    duration: resource.duration,
    thumnailurl: resource.thumbnailUrl,
    progress: 5,
    title: resource.fileName,
    time: new Date('2003-02-22'), // Sửa định dạng ngày cho đúng
    description: resource.description,
    tags: resource.tags,
    status: resource.transcodingStatus,
    public: true, // TODO: Thay giá trị cứng bằng logic động
  }));
}

export function mapToExerciseQuiz(ex: ExerciseCodeResponse): ExerciseQuiz {
  return {
    id: ex.id,
    user: ex.user,
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
