import { Component, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { setting } from '../settings';
import { SearchService } from '../services/search.service';
import { CookieService } from 'ngx-cookie-service';
import { Http, RequestOptions, Headers, RequestMethod, ResponseContentType } from '@angular/http';
import { VstoHelperApi } from '../VstoHelperApi';
import 'rxjs/Rx' ;

declare var $: any;

@Pipe({name: 'KeyValuePair'})
export class KeyValuePipe implements PipeTransform {
  transform(dict, args:string[]) : any {
    let keyValuePairs = [];
    for (let key in dict) {
        keyValuePairs.push({key: key, value: dict[key]});
    }
    return keyValuePairs;
  }
}

@Component({
    templateUrl: './upload-home.component.html',
    styleUrls: ['./upload-home.component.css']
})

/* 
 * @package upload-home
 * UploadHomeComponent    UploadHomeComponent is the screen which displays the template category section,
 */
export class UploadHomeComponent{
    conceptResult:any=[];
    resarray:any=[];
    popUpAlert:boolean;
    serverVersion:any;
    popUpmessage:any;
    selectedSlideIdList:any=[];
    selectedThumbnail=[];
    constructVisible:boolean;
    parent:any;
    uploadResponse:any;
    slideResponse:any;
    construct:any;
    concept:any;
    constructVisibleModal:boolean;
    closeSlideID:any;
    closeSlideIndex:any;
    useremail:any;

    constructor(public router:Router,  
        private searchService: SearchService,
        private cookieService: CookieService,
        private http: Http) 
    { 
        this.getConcepts();
        this.viewSelected();
        this.groupSummary =
        {
            "hasIcon" : false,
            "hasImage" : false,
            "layout" : "Basic",
            "style" : "Basic",
            "content" : "Limited",
            "construct" : "Divergent",
            "tags" : "",
            "concept" : "",
            "enabled" : false
        };
        this.useremail = setting.UserEmail;
    }

    /*
     * ngOnInit()   ngOnInit is called right after the directive's data-bound properties have been checked for the first time, and before any of its children have been checked.
     */
    ngOnInit() {}

    /*
    * getConcepts()     getConcepts() is used to load in the Template section and Advanced search, the result in concept is fetched from API Call
    */ 
    getConcepts(){
        this.searchService.getConcepts()
        .subscribe(respons => {
            this.resarray = respons;
            console.log(JSON.stringify(this.resarray));
            for(let off of this.resarray){
                if(off.enabled == true){
                    this.conceptResult.push(off);
                }
            }
        });
    }

    editSelected(){
        this.groupApply();
    }

    submitSelected(){
        for(let i=0; i < this.selectedThumbnail.length; i++){
            if(this.selectedThumbnail[i].construct == "" || this.selectedThumbnail[i].construct == undefined){
                this.showMessage("Please select the construct");
            }else if(this.selectedThumbnail[i].tags == "" ||this.selectedThumbnail[i].tags == null){
                this.showMessage("Please enter tags");
            }else
            {
                var tags = this.selectedThumbnail[i].tags;
                var filename = "Slide-"+this.selectedThumbnail[i].concept+"-"+this.selectedThumbnail[i].construct+"-"+Date.now();
                var imageUrl = setting.UPLOAD_APIURL + "/image/" + this.selectedThumbnail[i].id+".JPG";
                var slideUrl = setting.UPLOAD_APIURL + "/slide/" + this.selectedThumbnail[i].id+".pptx";
                var filenamejpg = filename+".JPG";
                var filenamepptx = filename+".PPTX";
                this.showMessage("Uploading");
                this.http.get(imageUrl, {responseType: ResponseContentType.Blob})
                .subscribe(res=>{
                    var imageBlob = new Blob([res["_body"]], {type: 'image/jpeg'});
                    this.http.get(slideUrl, {responseType: ResponseContentType.Blob})
                    .subscribe(res=>{
                        console.log("parent - ", this.selectedThumbnail[i].parent);
                        var slideBlob = new Blob([res["_body"]], {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
                        const formData: FormData = new FormData();
                        formData.append('enabled', this.selectedThumbnail[i].enabled);
                        formData.append('imageFile', imageBlob, filenamejpg);
                        formData.append('pptxFile', slideBlob, filenamepptx);
                        formData.append('parent', this.selectedThumbnail[i].parent);
                        formData.append('tags', JSON.stringify(tags));
                        formData.append('hasIcon', this.selectedThumbnail[i].hasIcon);
                        formData.append('hasImage', this.selectedThumbnail[i].hasImage);
                        formData.append('layout', this.selectedThumbnail[i].layout);
                        formData.append('style', this.selectedThumbnail[i].style);
                        formData.append('content', this.selectedThumbnail[i].content);                
                        let headers = new Headers();
                        headers.append('Content-Type', 'multipart/form-data');
                        let body = formData;
                        console.log(body);
                        let options = new RequestOptions();
                        let url = setting.APIURL+"/slidedb/slides/";
                        this.http.post(url, body, options)
                        .subscribe(result => 
                        {
                            this.slideResponse = result;
                            this.hideMessage();
                            this.selectedThumbnail.splice(i,1);
                            this.selectedSlideIdList.splice(i,1);
                        },
                        (err)=>{
                            this.showMessage(err);
                        });
                    })
                })
            }
        }
    }
     
    async viewSelected()
    {
        const api = new VstoHelperApi(this.http);
        var serverVersion = await api.GetVersion();
        if(serverVersion === '0')
        {
          //show error message
          setTimeout(() => {
            this.showMessage('Could not connect with helper plugin. Please ensure that PowerPoint is running on local machine and <a href="/assets/VstoHelper-Installer-v' + setting.VstoVersion + '.msi">helper VSTO plugin</a> is already installed');
          }, 3000);
        }
        else if (serverVersion === setting.VstoVersion){
            let rnd = api.getRandomInt(1,10000);
            api.getSelectedSlides(rnd) 
            .subscribe(res => {
                console.log(res);
                if(res.length == 0){
                    this.showMessage("Please select slides to upload");
                }else{
                    res=res.sort((a,b) => 0 - (a > b ? -1 : 1));
                    this.getSelectedSlides(res);
                }
            })
        } else {
          //show error
          setTimeout(() => {
            this.showMessage('You have an old version of helper plugin. Please download latest version <a href="/assets/VstoHelper-Installer-v' + setting.VstoVersion + '.msi">helper VSTO plugin</a>')
          }, 3000);
        }
    }
    storedData=[];
    storedId=[];
    id=[];
    getSelectedSlides(selectedSlideIdList:any){
        this.saveInLocal();
        this.selectedThumbnail=[];
        for(let i=0; i < selectedSlideIdList.length;i++){
            if(selectedSlideIdList[i] in localStorage){
                this.selectedThumbnail.push(JSON.parse(this.retrieveData(selectedSlideIdList[i])));
            }else{
                var imageUrl = setting.UPLOAD_APIURL + "/image/" + selectedSlideIdList[i]+".JPG";
                var imgPathPng = setting.UPLOAD_APIURL + "/image/" + selectedSlideIdList[i]+".png";
                var slideUrl = setting.UPLOAD_APIURL + "/slide/" + selectedSlideIdList[i]+".pptx";
                this.selectedThumbnail.push(
                    {
                        "id":selectedSlideIdList[i],
                        "parent": "",
                        "pptxFile": slideUrl,
                        "tags": [],
                        "enabled": false,
                        "imageFile": imageUrl,
                        "hasIcon": false,
                        "hasImage": false,
                        "layout": "Basic",
                        "style": "Basic",
                        "content":"Limited",
                        "construct":"",
                        "concept":""
                    });
            }
            this.storeData(selectedSlideIdList[i], this.selectedThumbnail[i]);
        }
    }

    constructClick(){
        this.constructVisible = !this.constructVisible;
    }
    
    constructItemClick(index:any,concept:any, construct:any, id:any){
        this.parent = setting.APIURL+"/slidedb/constructs/"+id+"/";
        this.constructClick();
        this.selectedThumbnail[index].concept = concept;
        this.selectedThumbnail[index].construct = construct;
        this.selectedThumbnail[index].parent = this.parent;
    }

    submit(i:any, id:any)
    {
        if(this.selectedThumbnail[i].construct == "" || this.selectedThumbnail[i].construct == undefined){
            this.showMessage("Please select the construct");
        }else if(this.selectedThumbnail[i].tags == "" ||this.selectedThumbnail[i].tags == null){
            this.showMessage("Please enter tags");
        }else
        {
            var tags = this.selectedThumbnail[i].tags;
            var filename = "Slide-"+this.selectedThumbnail[i].concept+"-"+this.selectedThumbnail[i].construct+"-"+Date.now();
            var imageUrl = setting.UPLOAD_APIURL + "/image/" + this.selectedThumbnail[i].id+".JPG";
            var slideUrl = setting.UPLOAD_APIURL + "/slide/" + this.selectedThumbnail[i].id+".pptx";
            var filenamejpg = filename+".JPG";
            var filenamepptx = filename+".PPTX";
            this.showMessage("Uploading");
            this.http.get(imageUrl, {responseType: ResponseContentType.Blob})
            .subscribe(res=>{
                var imageBlob = new Blob([res["_body"]], {type: 'image/jpeg'});
                this.http.get(slideUrl, {responseType: ResponseContentType.Blob})
                .subscribe(res=>{
                    console.log("parent - ", this.selectedThumbnail[i].parent);
                    var slideBlob = new Blob([res["_body"]], {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
                    const formData: FormData = new FormData();
                    formData.append('enabled', this.selectedThumbnail[i].enabled);
                    formData.append('imageFile', imageBlob, filenamejpg);
                    formData.append('pptxFile', slideBlob, filenamepptx);
                    formData.append('parent', this.selectedThumbnail[i].parent);
                    formData.append('tags', JSON.stringify(tags));
                    formData.append('hasIcon', this.selectedThumbnail[i].hasIcon);
                    formData.append('hasImage', this.selectedThumbnail[i].hasImage);
                    formData.append('layout', this.selectedThumbnail[i].layout);
                    formData.append('style', this.selectedThumbnail[i].style);
                    formData.append('content', this.selectedThumbnail[i].content);
                    let headers = new Headers();
                    headers.append('Content-Type', 'multipart/form-data');
                    let body = formData;
                    let options = new RequestOptions({ headers: headers });
                    let url = setting.APIURL+"/slidedb/slides/";
                    this.http.post(url, body, options)
                    .subscribe(result => 
                    {
                        this.slideResponse = result;
                        this.hideMessage();
                        this.selectedThumbnail.splice(i,1);
                        this.selectedSlideIdList.splice(i,1);
                    },
                    (err)=>{
                        this.showMessage(err);
                    });
                })
            })
        }
    }

    showMessage(message:any) //Displays the Pop-up message
    {
        this.popUpAlert = true;
        this.popUpmessage = message;
        $("#showMsgModal").modal('show');
    }

    hideMessage() //Hides the Pop-up message
    {
        $("#showMsgModal").modal('hide');
    }
    /*		
	    * authenticate()      authenticate() function is used the authenticate the user for voting the slide,		
    */		
    authenticate(){		
        this.searchService.authenticate("authenticate")		
	    .subscribe(data => {		
	        data => {		
	            var response = data;		
	            console.log(response);		
	            var resultMessage="Authenticated successfully";		
	            this.showMessage(resultMessage);		
	        }		
	    },		
	    (err)=>{		
	       this.showMessage(err);		
        });
    }

    groupApply(){
        this.getSelectedSlideMetadataSummary();
        const api = new VstoHelperApi(this.http);
        let rnd = api.getRandomInt(1,10000);
        api.getSelectedSlides(rnd)
        .subscribe(res => {
            console.log("LIST -> "+res + " = " + this.selectedSlideIdList);
            if(res.length == 0){
                this.showMessage("Please select slides to upload");
            }else if(res.length == 1){
                $("#showGroupApplyModal").modal('show');
            }else{
                $("#showGroupApplyModal").modal('show');
                this.getSelectedSlides(res);
            }
        });
    }
    
    /*
    * projectToField   function is used to push the array for selected fieldName
    * @params       objArr  is the parameter which contain array of values passed into the projectToField function
    *               fieldName  is the parameter, is pushed into the array
    */
    projectToField(objArr, fieldName){
        var fieldValueArr=[];
        for(let obj of objArr){
          fieldValueArr.push(obj[fieldName]);
        }
        return fieldValueArr;
    }

    /*
    * summarizeGroup   function is used to check if the array contains same values the array for selected fieldName
    * @params       objArr  is the parameter which counts if the array value is same, if same returns [true, result] else returns [false, "Many values"]
    */
    summarizeGroup(objArray) {
        var firstVal = objArray[0];
        var count=0;
        for(let i=0;i<objArray.length;i++){
          if(firstVal == objArray[i]){
            count =count+1;
          }
        }
        if(count == objArray.length){
            return [true, objArray[0]];
          }else{
            return [false, "ManyValues"];
        }
    }

    /*
    * union   function is used to check if the array contains same values the array for selected fieldName
    * @params       set1  is the parameter which contains first array value, and added into the unionSet
    *               set2  is the parameter which contains second array value, and added into the unionSet
    */
    union(set1, set2)
    {
        // creating new set to store union
        var unionSet = new Set();
    
        // iterate over the values and add 
        // it to unionSet
        set1.forEach(elem =>{
            unionSet.add(elem);
        })
    
        // iterate over the values and add it to 
        // the unionSet
        set2.forEach(elem =>{
            unionSet.add(elem);
        })
        // return the values of unionSet
        return unionSet;
    }

    // Performs intersection operation between
    // called set and otherSet
    intersection(set1, set2)
    {
        // creating new set to store intersection
        var intersectionSet = new Set();
    
        // Iterate over the values 
        set2.forEach(elem => {
            // if the other set contains a 
            // similar value as of value[i]
            // then add it to intersectionSet
            if(set1.has(elem))
                intersectionSet.add(elem);
        })
        
        // return values of intersectionSet
        return intersectionSet;                
    }

    // Performs difference operation between
    // called set and otherSet
    difference(set1, set2)
    {
        // creating new set to store differnce
        var differenceSet = new Set();
    
        // iterate over the values
        set1.forEach(elem => {
            // if the value[i] is not present 
            // in otherSet add to the differenceSet
            if(!set2.has(elem))
                differenceSet.add(elem);
        })
    
        // returns values of differenceSet
        return differenceSet;
    }

    /*
    * summarizeGroupTags   function is used to check listOfList contains commonSet and otherSet
    * @params       listOfList  is the parameter checks difference between the unionSet, IntersectionSet
    */
    summarizeGroupTags(listOfList)
    {
        var listOfSet = listOfList.map(function(ls) {return new Set(ls);})
        var unionSet = new Set();
        listOfSet.forEach(objSet => {
            unionSet = this.union(unionSet, objSet);
        });
        
        var intersectionSet = unionSet;
        listOfSet.forEach(objSet => {
            intersectionSet = this.intersection(intersectionSet, objSet);
        });
        
        var otherSet = this.difference(unionSet, intersectionSet);
        
        var result = {};
        intersectionSet.forEach(tag =>{
            result[tag] = "+";
        })
        otherSet.forEach((tag) =>{
            result[tag] = "*";
        })
        return result;
    }
    
    groupSummary:object;
    tagSummary=[];
    getSelectedSlideMetadataSummary(){
        this.groupSummary = {};
        ["hasIcon", "hasImage", "layout", "style", "content", "construct", "concept", "parent", "enabled"].forEach( 
            field => 
            {
                this.groupSummary[field] = this.summarizeGroup(this.projectToField(
                    this.selectedThumbnail, field))
            });
        this.groupSummary["tags"] = this.summarizeGroupTags(this.projectToField(
            this.selectedThumbnail, "tags")); 
    }

    // groupApplyClick   function used to display values from dialog to slide view
    groupApplyClick(){
        var tagSummary = this.groupSummary["tags"];
        this.selectedThumbnail.forEach(
            thumbnail =>
            {
                ["hasIcon", "hasImage", "layout", "style", "content", "construct", "concept", "parent", "enabled"].forEach( 
                    field => 
                    {
                        var fieldValue = this.groupSummary[field][1];

                        if (fieldValue != "ManyValues") 
                        {
                            {
                                thumbnail[field] = fieldValue;
                            }
                        }
                    }
                );
                for (let tag in tagSummary)
                {
                    if(tagSummary[tag] == "+")
                    {
                        if(thumbnail["tags"].indexOf(tag) == -1){
                            thumbnail["tags"].push(tag); 
                        }
                    }
                    else if(tagSummary[tag] == "-")
                    {
                        thumbnail["tags"].splice(thumbnail["tags"].indexOf(tag), 1);
                    }
                }
                // thumbnail["parent"] = this.groupSummary["parent"];
            }
        );
        $("#showGroupApplyModal").modal('hide');
    }
    
    /*
    * constructItemClickModal   function is called when concept is clicked in the dialog
    * @params   concept  which contains the concept value from the dialog view
    *           construct  which contains the construct value from the dialog view
    *           id  which contains the construct id
    */ 
    constructItemClickModal(concept:any, construct:any, id:any){
        var parent = setting.APIURL+"/slidedb/constructs/"+id+"/";
        this.constructClickModal();
        this.groupSummary["construct"][1] = construct;
        this.groupSummary["concept"][1] = concept;
        this.groupSummary["parent"][1] = parent;
        this.construct = construct;
        this.concept =concept;
    }

    // constructClickModal   function is used to enable and disable the construct and concept list
    constructClickModal(){
        this.constructVisibleModal = !this.constructVisibleModal;
    }
    
    // closeSlide   function used to remove the slide from the slide view
    closeSlide(i:any, id:any){
        this.closeSlideIndex = i;
        this.closeSlideID = id;
        $("#showConfirmDialog").modal('show');
    }

    tempData=[];
    // yesConfirmDialog     function used when user clicks the "yes" in the exit pop-up dialog
    yesConfirmDialog(id:any, index:any)
    {
        localStorage.removeItem(id);
        this.storeData(id, this.selectedThumbnail[index]);
        this.selectedThumbnail.splice(index, 1);
        this.selectedSlideIdList.splice(index, 1);
        $("#showGroupApplyModal").modal('hide');
        $("#showConfirmDialog").modal('hide');
    }

    // noConfirmDialog  function hides the exit pop-up dialog
    noConfirmDialog(){
        $("#showConfirmDialog").modal('hide');
    }

    // cancelClick  function hides the pop-up dialog if user clicks cancel button
    cancelClick(){
        $("#showGroupApplyModal").modal('hide');
    }
    
    // addTagClick   function used to add the tag in the groupSummary, and updates the view in metadata dialog
    addTagClick(tag)
    {
        this.addTagValue="";
        
        // HACK: Duplicating this.groupSummary["tags"], because otherwise the tags are not refreshing.
        this.groupSummary["tags"]= Object.assign({}, this.groupSummary["tags"]); 
        console.log("tags",tag);
        tag = tag.replace(/[\s]/g, '');
        tag = tag.split(';');
        tag=  tag.filter(v=>v!='');
        console.log("tags",tag);
        for(let ta of tag){
            if(!(ta in this.groupSummary["tags"])){
                this.groupSummary["tags"][ta]="+";
            }
        }        
        console.log(this.groupSummary["tags"]);
    }

    addTagValue:any;
    // addTag   function used to add tag in the slide view
    addTag(tag:any, id:any){
        console.log(tag, id);
        if(tag == "" || tag == null || tag==undefined){}
        else{
            console.log("tags",tag);
            tag = tag.replace(/[\s]/g, '');
            tag = tag.split(';');
            tag=  tag.filter(v=>v!='');
            console.log("tags",tag);
            for(let ta of tag){
                if(this.selectedThumbnail[id].tags.indexOf(ta) == -1){
                    this.selectedThumbnail[id].tags.push(ta);
                }
            }
            this.addTagValue="";
        }
    }

    // tagsClick    function used to removes the selected tag from the tags for a particular slide
    tagsClick(tagName, id, tagId){
        const index: number = this.selectedThumbnail[id].tags.indexOf(tagName);
        this.selectedThumbnail[id].tags.splice(index, 1);
    }
    
    // checkBoxToggle     function is used to display the tags in tri-state concept(checked, unchecked, indeterminate)
    checkBoxToggle(checkBox, tagSummary, tag, init) 
    {
        if(!init)
        {
            if(tag.value == '+'){
                tag.value="*";
            } else if(tag.value == '*'){
                tag.value="-";
            } else if(tag.value == '-'){
                tag.value="+";
            }else{
                tag.value = tag.value;
            }
        }
        if(tag.value == '+'){
            $('#'+checkBox).prop('checked',true);
            $('#'+checkBox).prop('readOnly',true);
            $('#'+checkBox).prop('indeterminate',false);
        } else if(tag.value == '*'){
            $('#'+checkBox).prop('checked',false);
            $('#'+checkBox).prop('readOnly',true);
            $('#'+checkBox).prop('indeterminate',true);
        } else if(tag.value == '-'){
            $('#'+checkBox).prop('checked',false);
            $('#'+checkBox).prop('readOnly',false);
            $('#'+checkBox).prop('indeterminate',false);
        } else {
            $('#'+checkBox).prop('checked',true);
            $('#'+checkBox).prop('readOnly',false);
            $('#'+checkBox).prop('indeterminate',false);
        }
        tagSummary[tag.key] = tag.value;
    }
    
    // checkBoxChecked      function used when tags are pre-loaded from the slide view
    checkBoxChecked(checkBox, tag)
    {
        if(tag.value == '+'){
            $('#'+checkBox).prop('checked',true);
        }else if(tag.value == '*'){
            $('#'+checkBox).prop('indeterminate',true);
        }else if(tag.value == '-'){
            $('#'+checkBox).prop('checked',false);
        }else{
            //$('#'+checkBox).prop('checked',true);
        }
    }

    home(){
        this.saveInLocal();
        this.router.navigate(['/search']);
    }
    icons(){
        this.saveInLocal();
        this.router.navigate(['/icons']);
    }

    metrics(){
        this.saveInLocal();
        this.router.navigate(['/metrics']);
    }

    saveInLocal(){
        for(let j=0; j<this.selectedThumbnail.length;j++){
            this.storeData(this.selectedThumbnail[j].id, this.selectedThumbnail[j]);
            this.selectedSlideIdList.push(this.selectedThumbnail[j].id);
        }
        this.selectedThumbnail=[];

        for(let i=0; i < this.selectedSlideIdList.length;i++){

            if(this.selectedSlideIdList[i] in localStorage){
                this.selectedThumbnail.push(JSON.parse(this.retrieveData(this.selectedSlideIdList[i])));
            }else{
                var imageUrl = setting.UPLOAD_APIURL + "/image/" + this.selectedSlideIdList[i]+".JPG";
                var imgPathPng = setting.UPLOAD_APIURL + "/image/" + this.selectedSlideIdList[i]+".png";
                var slideUrl = setting.UPLOAD_APIURL + "/slide/" + this.selectedSlideIdList[i]+".pptx";
                this.selectedThumbnail.push(
                    {
                        "id":this.selectedSlideIdList[i],
                        "parent": "",
                        "pptxFile": slideUrl,
                        "tags": [],
                        "enabled": false,
                        "imageFile": imageUrl,
                        "hasIcon": false,
                        "hasImage": false,
                        "layout": "Basic",
                        "style": "Basic",
                        "content":"Limited",
                        "construct":"",
                        "concept":""
                    });
            }
        }
    }
    
    storeData(id, data){
        localStorage.setItem(id, JSON.stringify(data));
    }
    retrieveData(id){
        return localStorage.getItem(id);
    }
}
