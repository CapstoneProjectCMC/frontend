import { avatarUrlDefault } from '../../core/constants/value.constant';
import { ExerciseCodeResponse } from '../../core/models/code.model';
import {
  CommentResponse,
  ICommentFilmResponse,
} from '../../core/models/comment.models';
import {
  CreateExerciseRequest,
  ExerciseItem,
  ExerciseQuiz,
} from '../../core/models/exercise.model';
import {
  PostADD,
  PostCardInfo,
  PostResponse,
  Post,
} from '../../core/models/post.models';
import {
  MediaResource,
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
    orgId: post.orgId ?? '',
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
  };
}
export function mapPostdatatoPostCardInfo(post: PostResponse): PostCardInfo {
  let tagInput = post.hashtag || '';
  let taglist = tagInput
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0); // loại bỏ tag rỗng

  return {
    id: post.postId,
    avatar: post.user?.avatarUrl || avatarUrlDefault,
    author: post.user?.displayName || 'Ẩn danh',
    accountName: post.user?.username || '',
    email: post.user?.email || '',
    title: post.title,
    time: post.createdAt,
    description: post.content,
    tags: taglist,
    comment: post.commentCount,
    upvote: post.upvoteCount,
    downvote: post.downvoteCount,
    public: post.isPublic,
    allowComment: post.allowComment,
  };
}
export function maptoReourseCard(resourse: MediaResource): resourceCardInfo {
  return {
    id: resourse.id,
    avatarAuthor:
      'https://i.pinimg.com/736x/8b/8e/ff/8b8eff070443cf6103c8279a28673809.jpg',
    authorId: resourse.id,
    authorName: 'author',
    duration: resourse.duration?.toString() || '',
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
  resources: MediaResource[]
): resourceCardInfo[] {
  return resources.map((resource) => ({
    id: resource.id,
    avatarAuthor:
      'https://i.pinimg.com/1200x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg',
    authorId: resource.id,
    authorName: 'Ẩn danh',
    duration: resource.duration?.toString() || '',
    thumnailurl: resource.thumbnailUrl,
    progress: 5,
    title: resource.fileName,
    time: new Date(resource.createdAt), // Sửa định dạng ngày cho đúng
    description: resource.description,
    tags: resource.tags,
    status: 'accepted',
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
    purchased: ex.purchased,
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

export function mapPostDetailsToStructurePostPage(post: PostResponse): Post {
  return {
    id: post.postId,
    orgId: post.orgId,
    title: post.title,
    content: post.content,
    tags: post.hashtag.split(',').map((item) => item.trim()),
    field: post.fileUrls,
    metrics: {
      view: 0,
      up: post.upvoteCount,
      down: post.upvoteCount,
      commentCount: post.commentCount,
    },
  };
}

export function mapCommentToFilmResponse(
  comment: CommentResponse
): ICommentFilmResponse {
  return {
    id: comment.commentId,
    parentId: comment.parentCommentId ?? null,
    content: comment.content,
    isDeactivated: false, // default vì trong Comment không có field này
    createdAt: comment.createdAt, // hoặc gán giá trị mặc định
    updatedAt: new Date().toISOString(), // tùy use case
    user: {
      id: comment.user.userId,
      username: comment.user.username,
      email: comment.user.email, // optional
      role: comment.user.roles?.[0], // tạm lấy role đầu tiên (nếu có)
      avatarUrl: comment.user.avatarUrl,
      backgroundUrl: undefined, // default vì không có trong User
    },
    replies: comment.replies?.map(mapCommentToFilmResponse) ?? [],
  };
}

export function mapCommentsToFilmResponses(
  comments: CommentResponse[]
): ICommentFilmResponse[] {
  return comments.map(mapCommentToFilmResponse);
}
