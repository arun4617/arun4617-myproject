import { Component, Input  } from '@angular/core';
import { Slide } from '../slide';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { setting } from '../settings';


@Component({
    selector: 'app-slides',
    templateUrl: './slides.component.html',
    styleUrls: ['./slides.component.css']
})

/* 
* @package slides
*  
* SlidesComponent is used to display the search result, 
*/
export class SlidesComponent {
    @Input() slideList: Slide[];

    /*
    * Constructor: Called when class is instantiated.
    */
    constructor(private http: Http) {
     }
 
     // getSlideThumbnail Function returns the thumbnailfile image to the image page,
    getSlideThumbnail(slide: Slide): String {
        return setting.THUMBNAILURL +"slide/"+slide.thumbnail;
    }

    /*
    * copyFile()
    * 
    * @param   slide is the parameter which passed the .pptx link as paramString and API call takes place, 
    */ 
    copyFile(slide:any){
        let paramsString = slide.pptFile;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
 
        let options = new RequestOptions({ headers: headers });
         this.http.post('https://localhost:1234', paramsString)
            .map(res => res.json())
            .subscribe(
              data => console.log("DATA - "+data),
              err => console.log("ERROR - "+err),
              () => console.log('Request Complete')
            );
    }

}