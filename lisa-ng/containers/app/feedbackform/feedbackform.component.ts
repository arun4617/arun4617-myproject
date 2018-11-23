import { Component } from '@angular/core';
import { Construct } from '../construct';
import { ConstructService } from '../services/construct.service';
import { SearchService } from '../services/search.service';
import { Slide } from '../slide';

import {setting} from '../settings';

/*
* @Component     selector: 'app-feedbackform' is the keyword which displays the feedback form section using the tag <app-feedbackform></app-feedbackform>
*/
@Component({
    selector: 'app-feedbackform',
    templateUrl: './feedbackform.component.html',
    styleUrls: ['./feedbackform.component.css']
})

/* 
* @package footer
* 
* FooterComponent    Footer component displays footer section at the bottom of all pages.
* 
*/
export class FeedbackformComponent {
    // Feedback form variable declaration
    feedbackForm:boolean;
    bugform:boolean;
    featureform:boolean;
    lisaarea:boolean;
    areaSelect:any;
    suggestion:any;
    templateURL:any;
    areaResponse:any;
    areaResult:any;
    suggestOption:any;
    feedbackAlert:boolean;
    feedbackMessage:any;
    mailURL:any;
    showpopup:boolean;
    emailto:any;
    emailsubject:any;
    emailbody:any;                  
  
    /*
    * Constructor: Called when class is instantiated.
    * 
    * @param     Contains 2 params namely constructService,slideService. constructService gets the result array in template section and SearchService gets the result from web service
    * Get the default string value for toggledevprod and apiurl frrm the global file footerglobal.ts
    */  
    constructor(private constructService: ConstructService, private searchService: SearchService) 
    {
        this.areaResponse = {"results":[{"id":1,"name":"*"},{"id":2,"name":"Angular App"},{"id":5,"name":"REST API"},{"id":6,"name":"Search"},{"id":7,"name":"VSTO Helper"},{"id":8,"name":"Workflow"},{"id":3,"name":"AutoTagging"},{"id":4,"name":"DevOps"}]};
        this.areaResult = this.areaResponse.results;
        this.suggestOption = true;
        this.areaSelect = "Select area";
    }

        /*
    * areaDropDown()      areaDropDown() function which displays dropdown list
    */
   areaDropDown(){
    this.lisaarea = !this.lisaarea;
    }
    /*
    * areaItemClick()      areaItemClick() function to select the item from the list
    * @params       name params which passed the selected name value and displayed
    */
    areaItemClick(name:any){
        if(name == "*"){
            this.areaSelect =  "Lisa";
        }else{
            this.areaSelect =  name;
        }

        this.lisaarea = false;
    }
    /*
    * sendEmailRequest()      sendEmailRequest() function which displays confirmation pop-up with To, Subject and Body
    * @params       areaselect params which passed the selected name value 
    *               suggestOption  params which passed the option suggestion choosed by the user
    */
    sendEmailRequest(areaselect:any, suggestOption:any,emailRequest:any){
        if(emailRequest == "mail")
        {
            if(areaselect == undefined || areaselect == "Select area"|| areaselect==""){
                console.log("Please select area");
                this.feedbackAlert=true;
                this.feedbackMessage="Please select area";
                setTimeout(() => {
                    this.lisaarea=true;
                    this.feedbackAlert=false;
                    this.feedbackMessage="";
                }, 2000);
            }else{
                this.showpopup = true;
                this.emailto = "lisa-support@prezentium.com";
            
                if(suggestOption == true){
                    this.suggestion = "Bug";
                }else{
                    this.suggestion = "Feature";
                }
                this.emailsubject = this.suggestion+" in Area:"+ areaselect;
                this.emailbody = "<Describe issue in detail>";
            }
            
        }
        else
        {
            this.showpopup = true;
            this.emailto = "lisa-support@prezentium.com";
            this.emailsubject = "Please create a VSTS account for me";
            this.emailbody = "<Please give justification>";
        }
        
    }
    /*
    * clickhere()      clickhere() function which which concatenates the To, Subject and Body content and send the mail to the recipient
    */
    clickhere(){
        this.mailURL="mailto:lisa-support@prezentium.com&amp;subject="+this.emailsubject+"&amp;body="+this.emailbody;
        window.location.href = this.mailURL;
    }
    /*
    * cancelemail()      cancelemail() function which dismiss the popup
    */
    cancelemail(){
        this.showpopup = false;
    }
    /*
    * gotoVsts()      gotoVsts() function which opens the VSTS page in the browser
    * @params       areaselect params which passed the selected name value 
    *               suggestOption  params which passed the option suggestion choosed by the user
    */
    gotoVsts(areaSelect:any, suggestRadio:any){
        console.log(areaSelect+" = "+suggestRadio);
        if(areaSelect == undefined || areaSelect == "Select area"|| areaSelect==""){
            console.log("Please select area");
            this.feedbackAlert=true;
            this.feedbackMessage="Please select area";
            setTimeout(() => {
                this.feedbackAlert=false;
                this.feedbackMessage="";
            }, 2000);
        }else{
            this.feedbackAlert=false;
            if(suggestRadio == true){
                console.log("true");
                this.suggestion = "bug";
            }else{
                console.log("false");
                this.suggestion = "feature";
            }
            
            if(areaSelect == "Lisa"){
                areaSelect = "lisa";
            }else{
                areaSelect = areaSelect.replace("\\","%5C");
                areaSelect = areaSelect.replace(" ","+");
                areaSelect = "lisa\\"+areaSelect;
            }
            this.templateURL = setting.BUGFEATUREURL+this.suggestion+"?%5BSystem.AreaPath%5D="+areaSelect;
            window.location.href = this.templateURL;
        }
    }
    

}