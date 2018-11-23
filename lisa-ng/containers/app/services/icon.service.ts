import { Injectable } from '@angular/core';
import { Icon } from '../icon';
import { ICONS } from '../mock-icons';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Http, ResponseContentType, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
 * @package   service
 *
 * IconService   IconService is the service which handles api call in icons page,
 */
@Injectable()
export class IconService {

  /*
   * Constructor: Called when class is instantiated.
   */
  constructor(private http: Http) { }

  /*
  * getIcons()   getIcons() is used to get the results stored in the mock-icons
  * 
  * @return   Returns the result from mock-icons.ts
  */ 
  getIcons(category: String): Observable<Icon[]> {
    return of(ICONS);
  }
  /*
  * getfRecentlyUsedIcons()   getfRecentlyUsedIcons() is used to get the results stored in the mock-icons
  * 
  * @return   Returns the result from mock-icons.ts
  */ 
  getfRecentlyUsedIcons(): Observable<Icon[]> {
    return of(ICONS);
  }

  /*
  * getImage()   getImage() is used to get the results stored in the mock-icons
  * 
  * @param   imageUrl:string is the parameter parsed with web service, 
  * @return   Returns the result from web service
  */ 
  getImage(imageUrl: string): Observable<Blob> {
    return this.http
        .get(imageUrl, { responseType: ResponseContentType.Blob })
        .map((res: any) => new Blob([res._body], {
          type: res.headers.get("Content-Type")
        }));
  }
}
