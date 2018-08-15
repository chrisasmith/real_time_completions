import { Injectable } from '@angular/core';

@Injectable()
export class LocalCacheService {

  constructor() { }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
