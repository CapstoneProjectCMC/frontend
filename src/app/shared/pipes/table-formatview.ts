import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFormatView',
  standalone: true,
})
export class TableFormatViewPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    let date: Date;

    // Nếu value là string hoặc number, chuyển thành Date
    if (typeof value === 'string' || typeof value === 'number') {
      date = new Date(value);
    } else if (value instanceof Date) {
      date = value;
    } else {
      return '';
    }

    // Kiểm tra date có hợp lệ không
    if (isNaN(date.getTime())) {
      return '';
    }

    // Format thành DD/MM/YYYY
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
