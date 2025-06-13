import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat',
})
export class DurationFormatPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
