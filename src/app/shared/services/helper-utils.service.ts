import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';

@Injectable()
export class HelperUtilsService {

    public isNullOrUndefined(obj: any, pathToCheck: string): boolean {
        if (typeof pathToCheck === 'string' && pathToCheck.length > 0 && !isNullOrUndefined(obj)) {
            const paths = pathToCheck.split('.');
            const idx =  _.findIndex(paths, (path) => {
                obj = obj[path];
                return isNullOrUndefined(obj);
            });
            return idx > -1;
        } else {
            return isNullOrUndefined(obj);
        }
    }
}
