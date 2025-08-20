import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns-jalali'; // or use another Jalali date library

@Pipe({
  name: 'persianDate',
  standalone: true,
})
export class PersianDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, 'yyyy/MM/dd');
  }
}
