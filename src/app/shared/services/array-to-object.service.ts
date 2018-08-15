import { Injectable } from '@angular/core';

@Injectable()
export class ArrayToObjectService {

  constructor() { }

  convert(key: string, convertThis: any[] = []): any {
    const temp = {};
    convertThis.forEach(item => {
      if (item) {
        temp[item[key]] = item;
      }
    });
    return temp;
  }

}
