import { Component } from '@angular/core';
import { PieChartComponent } from '../../../shared/components/my-shared/pie-chart/pie-chart';
import { BreadcrumbComponent } from '../../../shared/components/my-shared/breadcum/breadcrumb/breadcrumb.component';
import { PostCardComponent } from '../../../shared/components/my-shared/post-card/post-card';
import { PostCardInfo } from '../../../core/models/post.models';

@Component({
  selector: 'app-student-statistic',
  standalone: true,
  imports: [PieChartComponent, BreadcrumbComponent, PostCardComponent],
  templateUrl: './student-statistic.component.html',
  styleUrls: ['./student-statistic.component.scss'],
})
export class StudentStatisticComponent {
  postCardData: PostCardInfo = {
    id: '1',
    avatar:
      'https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-44.jpg',
    author: 'Nguyễn Văn A',
    title: 'Làm thế nào để tối ưu hóa hiệu suất của thuật toán cây nhị phân',
    time: '2025-07-20T10:00:00',
    description:
      'Cùng thảo luận kỹ thuật từ cơ bản đến nâng cao như memiization, code splitting, và vitualize long trong xử lý dữ liệu người dùng',
    tags: ['binarytree', 'Cơ bản', 'Hàm'],
    comment: 5,
    upvote: 12,
    downvote: 1,
    status: 'rejected',
    public: true,
  };
  postCardDataApproved: PostCardInfo = {
    id: '2',
    avatar:
      'https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-44.jpg',
    author: 'Nguyễn Văn A',
    title: 'Làm thế nào để tối ưu hóa hiệu suất của thuật toán cây nhị phân',
    time: '2025-07-20T10:00:00',
    description:
      'Cùng thảo luận kỹ thuật từ cơ bản đến nâng cao như memiization, code splitting, và vitualize long trong xử lý dữ liệu người dùng',
    tags: ['binarytree', 'Cơ bản', 'Hàm'],
    comment: 5,
    upvote: 12,
    downvote: 1,
    status: 'approved',
    public: true,
  };
  postCardDataPending: PostCardInfo = {
    id: '1',
    avatar:
      'https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-44.jpg',
    author: 'Nguyễn Văn A',
    title: 'Làm thế nào để tối ưu hóa hiệu suất của thuật toán cây nhị phân',
    time: '2025-07-20T10:00:00',
    description:
      'Cùng thảo luận kỹ thuật từ cơ bản đến nâng cao như memiization, code splitting, và vitualize long trong xử lý dữ liệu người dùng',
    tags: ['binarytree', 'Cơ bản', 'Hàm'],
    comment: 5,
    upvote: 12,
    downvote: 1,
    status: 'pending',
    public: true,
  };
  handleEdit = () => {
    console.log('Edit clicked');
  };
  handleDelete = () => {
    console.log('Delete clicked');
  };
  handleApprove = () => {
    console.log('Approve clicked');
  };
  handleSummary = () => {
    console.log('Summary clicked');
  };
  handleRejected = () => {
    console.log('reject');
  };
  handleComment = () => {
    console.log('Comment');
  };
  handleReport = () => {
    console.log('Report');
  };
  handleDownVote = () => {
    console.log('DownVote');
  };
  handleUpvote = () => {
    console.log('Upvote');
  };
  handleSave = () => {
    console.log('Save');
  };
}
