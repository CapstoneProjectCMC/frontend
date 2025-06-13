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
