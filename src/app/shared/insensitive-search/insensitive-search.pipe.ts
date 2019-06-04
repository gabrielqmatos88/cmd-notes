import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'insensitiveSearch'
})
export class InsensitiveSearch implements PipeTransform {
    transform(value: any[], term: string, prop?: string ): any[] {
        if (!value) {
            return [];
        }
        if (!term) {
            return value;
        }
        return value.filter( item => {
          if (prop && item[prop]) {
            return item[prop].toLowerCase().indexOf(term.toLowerCase()) > -1;
          } else {
            return item.toLowerCase().indexOf(term.toLowerCase()) > -1;
          }
        });
    }
}
