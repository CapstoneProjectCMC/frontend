import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '../../../utils/stringProcess';
import { resourceCardInfo } from '../../../../core/models/resource.model';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.html',
  styleUrls: ['./resource-card.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle],
})
export class ResourceCardComponent {
  @Input() resource!: resourceCardInfo;
  @Input() showControls: boolean = true;
  @Input() onEdit?: () => void;
  @Input() onDelete?: () => void;
  @Input() onApprove?: () => void;
  @Input() onRejected?: () => void;
  @Input() onReport?: () => void;
  @Input() onSave?: () => void;
  @Input() onMain?: (resourceId: string) => void;
  @Input() popular?: number = 0;
  @Input() variant: 'default' | 'horizontal' = 'default';
  showPopup = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.more-action') && !target.closest('.popup-menu')) {
      this.showPopup = false;
    }
  }

  // Biến tạm để hiển thị duration/pages

  // ngOnInit() {
  //   this.extractFileInfo();
  // }

  // // ==== Xử lý file ====
  // async extractFileInfo() {
  //   const file = this.resource?.fileResource;
  //   if (!file) return;

  //   if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
  //     const seconds = await this.extractVideoDuration(file);
  //     this.fileInfoLabel = this.formatDuration(seconds); // ví dụ: "03:25"
  //   } else if (file.type === 'application/pdf') {
  //     const pages = await this.extractPdfPageCount(file);
  //     this.fileInfoLabel = `${pages} trang`;
  //   } else {
  //     this.fileInfoLabel = '';
  //   }
  // }

  extractVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  }

  async extractPdfPageCount(file: File): Promise<number> {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    return pdf.numPages;
  }

  formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // ==== Các handler có sẵn ====
  handleMain() {
    this.onMain && this.onMain(this.resource?.['id']);
  }
  handleEdit() {
    this.onEdit && this.onEdit();
  }
  handleDelete() {
    this.onDelete && this.onDelete();
  }
  handleApprove() {
    this.onApprove && this.onApprove();
  }

  handleRejected() {
    this.onRejected && this.onRejected();
  }

  handleReport() {
    this.onReport && this.onReport();
  }
  handleSave() {
    this.onSave && this.onSave();
  }
  formatDate(time: Date) {
    return formatDate(time);
  }
}
