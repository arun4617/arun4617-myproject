import { Injectable } from '@angular/core';
import { Construct } from '../construct';
import { CONSTRUCTS } from '../mock-constructs';
import { Observable } from 'rxjs/Observable';
// Observable.of just creates a synchronous Observable from the arguments.
import { of } from 'rxjs/observable/of';

/*
 * @package   service
 *
 * ConstructService   ConstructService is the service which handles API call
 */
@Injectable()
export class ConstructService {
  /*
   * Constructor: Called when class is instantiated.
   */
   constructor() { }

   getConstructs(): Observable<Construct[]> {
     return of(CONSTRUCTS);
   }
}
