import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeEditorComponent } from '../../../shared/components/fxdonad-shared/code-editor/code-editor.component';

@Component({
  selector: 'app-code-editor-page',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CodeEditorComponent,
  ],
})
export class CodeEditorPage implements OnInit, AfterViewChecked {
  @ViewChild('chatScroll') private chatScroll!: ElementRef;

  //đầu vào và đề bài
  problemTitle = 'Two Sum';
  difficultyLevel = 'Medium';
  problemDescription =
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.';

  examples = [
    { id: 1, input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { id: 2, input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
  ];

  output = '';
  executionTime = '0';
  memoryUsage = '0';
  isRunning = false;
  hasError = false;

  //chatbot-message
  chatMessages: any[] = [];
  newMessage = '';

  //comment
  commentForm: FormGroup;
  comments: any[] = [];

  //rankings
  rankings = [
    {
      position: 1,
      username: 'codemaster',
      score: 100,
      time: 0.5,
      isCurrentUser: false,
    },
    {
      position: 2,
      username: 'user123',
      score: 95,
      time: 0.7,
      isCurrentUser: true,
    },
    {
      position: 3,
      username: 'devpro',
      score: 90,
      time: 0.8,
      isCurrentUser: false,
    },
  ];

  //test cases
  testCases: {
    id: number;
    input: string;
    expected: string;
    status: string | null;
  }[] = [
    {
      id: 1,
      input: 'nums = [2,7,11,15], target = 9',
      expected: '[0,1]',
      status: null,
    },
    {
      id: 2,
      input: 'nums = [3,2,4], target = 6',
      expected: '[1,2]',
      status: null,
    },
    {
      id: 3,
      input: 'nums = [3,3], target = 6',
      expected: '[0,1]',
      status: null,
    },
  ];

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatScroll.nativeElement.scrollTop =
        this.chatScroll.nativeElement.scrollHeight;
    } catch (err) {}
  }

  loadInitialData() {
    // Simulate loading initial chat messages
    this.chatMessages = [
      {
        type: 'bot',
        sender: 'AI Assistant',
        text: 'Hello! How can I help you with the problem?',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      },
    ];

    // Simulate loading initial comments
    this.comments = [
      {
        id: 1,
        username: 'user123',
        userAvatar: '',
        text: "Great problem! Here's how I approached it...",
        timestamp: new Date(),
        upvotes: 5,
        downvotes: 1,
        userVote: null,
      },
    ];
  }

  runCode() {
    this.isRunning = true;
    this.hasError = false;
    // Reset test case status
    this.testCases = this.testCases.map((tc) => ({ ...tc, status: null }));
    // Simulate code execution
    setTimeout(() => {
      this.output = '[0, 1]';
      this.executionTime = '0.05';
      this.memoryUsage = '5.2';
      this.isRunning = false;
      // Simulate test case checking
      this.testCases = this.testCases.map((tc) => ({
        ...tc,
        status: tc.expected === '[0,1]' ? 'pass' : 'fail',
      }));
    }, 1000);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatMessages.push({
      type: 'user',
      sender: 'You',
      text: this.newMessage,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    });

    this.newMessage = '';

    // Simulate bot response
    setTimeout(() => {
      this.chatMessages.push({
        type: 'bot',
        sender: 'AI Assistant',
        text: 'I understand you need help. Let me analyze the problem...',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      });
    }, 1000);
  }

  submitComment() {
    if (this.commentForm.valid) {
      const newComment = {
        id: this.comments.length + 1,
        username: 'user123',
        userAvatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        text: this.commentForm.value.comment,
        timestamp: new Date(),
        upvotes: 0,
        downvotes: 0,
        userVote: null,
      };

      this.comments.unshift(newComment);
      this.commentForm.reset();
    }
  }

  vote(commentId: number, voteType: string) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      if (comment.userVote === voteType) {
        comment.userVote = null;
        voteType === 'up' ? comment.upvotes-- : comment.downvotes--;
      } else {
        if (comment.userVote) {
          comment.userVote === 'up' ? comment.upvotes-- : comment.downvotes--;
        }
        comment.userVote = voteType;
        voteType === 'up' ? comment.upvotes++ : comment.downvotes++;
      }
    }
  }
}
