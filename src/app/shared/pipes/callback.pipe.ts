import { Pipe, PipeTransform } from '@angular/core';

// Pipes in a value, and evaluates it by what we're intending to KEEP.
// So, if value is true and our filter value is true, we KEEP the passed value

@Pipe({name: 'callback', pure: false })
export class CallbackPipe implements PipeTransform {
  transform(items: any[], callback: (item: any) => boolean): any[] {
    if(!items || !callback) { return items; }

    return items.filter(item => callback(item));
  }
}
