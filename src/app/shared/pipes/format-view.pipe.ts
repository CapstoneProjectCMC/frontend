import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatView',
  standalone: true, // Hỗ trợ standalone component
})
export class FormatViewPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '0';
    return value.toLocaleString('en-US'); // Thêm dấu , vào hàng nghìn
  }
}

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
