import { Component } from '@angular/core';
import { Construct } from '../construct';
import { Slide } from '../slide';

import {setting} from '../settings';

/*
* @Component     selector: 'app-footer' is the keyword which displays the footer section using the tag <app-footer></app-footer>
*/
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

/* 
* @package footer
* 
* FooterComponent    Footer component displays footer section at the bottom of all pages.
* 
*/
export class FooterComponent {
    APIURL:string;
    selectedAPI:string;
    /*
    * Constructor: Called when class is instantiated.
    * 
    * Get the default string value for changeDevProdLocal and apiurl from the global file footerglobal.ts
    */  
    constructor() 
    {
        this.selectedAPI = setting.interfaceMode;;
        this.setApiUrl();
    }

    /*
    * setApiUrl()   setApiUrl is the method called when the user change the select tag at the footer section,
    */
   setApiUrl(){
        console.log(this.selectedAPI);
        var APIUrl;
        if(this.selectedAPI == "lisadev"){
            APIUrl = setting.DEVURL;
        }else if(this.selectedAPI == "lisaprod"){
            APIUrl= setting.PRODURL;
        }else{
            APIUrl = setting.LOCALHOSTURL;
        }
        setting.APIURL = APIUrl;
    }
}