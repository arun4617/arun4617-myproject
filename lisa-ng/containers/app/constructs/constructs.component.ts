import { Component } from '@angular/core';
import { Construct } from '../construct';
import { ConstructService } from '../services/construct.service';
import { SearchService } from '../services/search.service';
import { Slide } from '../slide';
import { setting } from '../settings';

@Component({
    selector: 'app-constructs',
    templateUrl: './constructs.component.html',
    styleUrls: ['./constructs.component.css']
})
  
/* 
 * @package constructs
 * 
 * ConstructsComponent    Constructscomponent is the screen which displays the template category section,
 * 
 */ 
 
export class ConstructsComponent {
    constructs: Construct[];
    slidesResults: Slide[];
    selectedConstruct: number;

    /*
     * Constructor: Called when class is instantiated.
     */  
    constructor(private constructService: ConstructService, private searchService: SearchService) { }
  
    /*
     * ngOnInit()   ngOnInit is called right after the directive's data-bound properties have been checked for the first time, and before any of its children have been checked. ngoninit is instiated to call the getConstructs() function.
     */
    ngOnInit() {
      this.getConstructs();
    }
    /*
     * getConstructs()   getConstructs is used to get the results from REST API
     * 
     * @return   Returns the result from REST API
     */  
    getConstructs(): void {
      this.constructService.getConstructs()
        .subscribe(constructs => this.constructs = constructs);
    }

    /*
     * onSelect()   Function calls on clicking the template section and returns the sub-category 
     * 
     * @param    The onSelect() function pass the parameter as selected object from the result array
     * @return   Returns the result from mock-constructs.ts
     */
    onSelect(construct: Construct): void {
      if (this.selectedConstruct === construct.id) {
        this.selectedConstruct = -1;
      } else {
        this.slidesResults = new Array<Slide>();
        this.getSlides(construct.id);
        this.selectedConstruct = construct.id;
      }
    }
    /*
     * getSlides()   Function get call from the onselect function which pass id as parameter, which returns the array result to sub-category
     * 
     * @param    The getSlides() function pass the id:number parameter 
     * @return   Returns the result as array
     */
    getSlides(id: number): void {
      this.searchService.getSlides(id)
        .subscribe(slides => {this.slidesResults = slides;
                    console.log(this.slidesResults);});
    }

    /*
     * getImagePath()   Function to return the image path in template section 
     * 
     * @param    The getImagePath() function pass the parameter as selected object from the result array
     * @return   Returns path of the image in src attribute
     */
    getImagePath(construct: Construct): String {
      let path =  setting.THUMBNAILURL +"construct/" + construct.thumbnail;
      return path;
    }
}