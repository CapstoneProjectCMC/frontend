import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeHtml',
  standalone: true,
})
export class NormalizeHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // 1. Thay thế các thẻ <br> và các thẻ đóng/mở <p> bằng một khoảng trắng
    // Điều này "làm phẳng" các lần xuống dòng
    let normalized = value
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/?p.*?>/gi, ' ');

    // 2. Thay thế nhiều khoảng trắng liên tiếp bằng một khoảng trắng duy nhất
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  }
}
