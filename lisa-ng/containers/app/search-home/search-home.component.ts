import { Component, HostListener } from '@angular/core';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';
import { Http, RequestOptions, Headers, ResponseContentType, URLSearchParams } from '@angular/http';
import { setting } from '../settings';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { VstoHelperApi } from '../VstoHelperApi';
import { slideViewEditComponent } from '../viewedit-home/viewedit-home.component';
import { DatePipe } from '@angular/common';
import "isomorphic-fetch";

declare var $: any;
@Component({
    templateUrl: './search-home.component.html',
    styleUrls: ['./search-home.component.css']
})
/*
* @package search-home
*
* SearchHomeComponent    SearchHomeComponent is the main screen to display the homepage, at first the page displays an template section, if the user search any keywork constructshomecomponent display the search results, if there is no result, an pop-up is shown.
*/
export class SearchHomeComponent {
    // search keyword variable
    searchText: String;
    nextPageUrl: string;
    advancedSearch: boolean;
    icon:any;
    image:any;
    searchResults:any = [];
    constructResult:any=[];
    visualstyle:any;
    content:any;
    constructname:any;
    queryJson:any=[];
    popUpAlert:boolean;
    popUpmessage:any;
    tempSuggest:any;
    resultCount:any;
    public auth2:any
    constructsHome:boolean;
    conceptVisible:any;
    conceptArray:any=[];
    conceptNameArray:any=[];
    conceptResult:any=[];
    conceptDropdownDisplayText:any;
    smileySet:any=[];
    enabled:any;
    insertCount:any;
    downloadCount:any;
    slideIndex :any;
    rateSlideId:any;
    rateCount:any;
    downloadPopup:boolean;
    insertPopup:boolean;
    yesRatingPopup:boolean;
    noRatingPopup:boolean;
    noErrorRatingPopup:boolean;
    ratingPopUp:boolean;
    rowCount:any;
    getWidth:boolean;
    serverTime:any;
    serverTimeStatus=[];
    nodeAllAny:any;
    selectedNode=[];
    optionsModel: number[];
    myOptions=[];
    nodesValue:any;
    nodeVisible:boolean;
    nodesArray=[];
    nodeOptions=[{"id":"?","name":"?","status":true},{"id":2,"name":"2", "status": false },{"id":3,"name":"3","status":false},{"id":4,"name":"4","status":false},{"id":5,"name":"5","status":false},{"id":6,"name":"6","status":false},{"id":7,"name":"7","status":false},{"id":8,"name":"8","status":false},{"id":9,"name":"9","status":false},{"id":10,"name":"10","status":false},{"id":11,"name":"11","status":false},{"id":12,"name":"12","status":false},{"id":13,"name":"13","status":false},{"id":14,"name":"14","status":false},{"id":15,"name":"15","status":false},{"id":16,"name":"16","status":false},{"id":17,"name":"17","status":false},{"id":18,"name":"18","status":false},{"id":19,"name":"19","status":false},{"id":20,"name":"20","status":false}];
    nodeSearchArray=[];
    username:any;
    useremail:any;
    // slideEditView variable declaration
    slideImage:any;
    construct:any;
    concept:any;
    hasIcon:any;
    hasImage:any;
    style:any;
    layout:any;
    viewContent:any;
    viewEnabled:any;
    tags=[];
    slideId:any;
    indexId:any;
    friendlyId:any;
    parent:any;
    constructVisibleModal:boolean;
    addTagValue:any;
    closeSlideID:any;    
    imageFile:any;
    slideFile:any;
    filenamejpg:any;
    filenamepptx:any;
    uploadFile:boolean;
    slideEdit:any;
    nodeStart:any;
    nodeCount:any;
    nodeEnd:any;
    values:any;

    /*
    * Constructor: Called when class is instantiated,
    */
    constructor(private authService: AuthService, private searchService: SearchService, public http:Http, public router: Router,private cookieService: CookieService) {
        this.advancedSearch = false;
        this.constructsHome = true;
        this.icon="";
        this.image="";
        this.tempSuggest = true;
        this.resultCount = false;
        this.conceptVisible = false;
        this.conceptDropdownDisplayText = "All Constructs";
        this.nextPageUrl="";
        this.enabled = false;
        this.getConstructs();
        this.getConcepts();
        this.resetClick();
        
        this.slideEdit = new slideViewEditComponent(this, this.http);
        this.getSmileyIconValue();
        this.updateBrowserQuery();
        this.ratingPopUp = false;    
        this.getWidth = true;    
        this.rowCount = 10;
        this.whatsNew();
        this.nodeAllAny="false";
        this.getUserDetail();
    }
    
    ngOnInit(){
        this.myOptions = this.nodeOptions;
        this.nodesValue= "Nodes("+this.myOptions[0].id+")";
    }

    getUserDetail(){
        this.searchService.getUserDetail()
        .subscribe(userInfo => {
            this.useremail = userInfo.email;
            setting.UserEmail = this.useremail;
        });
    }
    updateBrowserQuery(){
        var uri = document.location.href;
        var uri_dec = decodeURIComponent(uri);
        this.queryJson = this.getKeyValue('query', uri_dec);
        if(this.queryJson == null || this.queryJson == "null"){
            this.queryJson=[];
        }else{
            this.advancedSearchClick(this.searchText, true);
        }
    }

    getKeyValue( name, url ) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : results[1];
    }

    /*
    * loadMore()    Web service call takes place when user clicks "Load More" at the bottom of the page, on success response displays the search result
    */
    loadMore(searchResultsnext){
        var curResultsPage=[];
        this.popUpAlert = true;
        this.popUpmessage = "Loading";
        $("#showMsgModalDialog").modal('show');
        this.searchService.loadSearchResults(searchResultsnext)
        .subscribe(slideQueryPageResult => {
            $("#showMsgModalDialog").modal('hide');
            curResultsPage = slideQueryPageResult.results["results"];
            for(let i=0; i < curResultsPage.length;i++){
                if(curResultsPage[i].myRating == null){
                    curResultsPage[i].myRating = "-";
                }
                curResultsPage[i].imageFile = setting.APIURL + curResultsPage[i].imageFile;
                curResultsPage[i].pptxFile = setting.APIURL + curResultsPage[i].pptxFile;
            }
            for(let curSearchResult of curResultsPage){
                this.searchResults.results.push(curSearchResult);
            }
            this.nextPageUrl = slideQueryPageResult.results["next"];
            this.getServerTimeStatus(slideQueryPageResult);
        });
    }

    /*
    * getConstructs()     getConstructs() is used to load in the Advanced search, the result in construct is fetched from API Call
    */
    getConstructs(){
        this.searchService.getConstructs()
        .subscribe(response => {
            this.constructResult = response;
        });
    }

    /*
    * getConcepts()     getConcepts() is used to load in the Template section and Advanced search, the result in concept is fetched from API Call
    */
    getConcepts(){
        this.searchService.getConcepts()
        .subscribe(conceptArray => {
            for(let concept of conceptArray){
                if(concept.enabled == true){
                    this.conceptResult.push(concept);
                }
            }
        });
    }

    /*
    * resetClick()   function is set all the values into default,
    */
    resetClick(){
        this.searchText = "";
        this.reset();
    }

    // advanceClick()    is displays the Advanced Search template
    advanceClick(){
        this.advancedSearch =! this.advancedSearch;
        this.reset();
    }

    // cancelClick()    hides the Advances search template
    cancelClick(){
        this.advancedSearch = false;
        this.reset();
    }

    reset(){
        this.icon = "";
        this.image = "";
        this.visualstyle = "";
        this.content = "";
        this.constructname = "";
        this.conceptVisible = false;
        this.conceptArray=[];
        this.enabled = false;
        if(this.conceptArray.length == 0){
            this.conceptDropdownDisplayText = "All Constructs";
        }else{
            this.conceptDropdownDisplayText = JSON.stringify(this.conceptArray);
        }
        this.nodesArray=[];
        this.nodeVisible=false;
        this.myOptions = this.nodeOptions;
        for(let i=0;i< this.myOptions.length;i++){
            if(i==0){
                this.myOptions[i].status=true;
            }else{
                this.myOptions[i].status=false;
            }
        }
        this.nodesValue= "Nodes("+this.myOptions[0].id+")";
        this.nodesArray.push(this.myOptions[0].id);
    }

    // filterClick()     filterClick() is situated in the Overlay, if user clicks the filter icon, the Advanced search template displays,
    filterClick(){
        this.advancedSearch = true;
        document.body.scrollTop = 0;
    }

    /*
    * advancedSearchClick()      advancedSearchClick() function is used the call the REST API with the multiple-parameters,
    */
    advancedSearchClick(searchText:any, queryStatus)
    {
        var searchParam, iconParam, imageParam, constructParam, visualstyleParam, contentParam, enabledParam, nodeParam, nodeExcludeParam;
        this.popUpAlert = true;
        var count;
        this.nodeSearchArray=[];
        if(queryStatus==true){
            this.popUpmessage = "Loading";
            $("#showMsgModalDialog").modal('show');
        }else{
            this.popUpmessage = "Searching";
            $("#showMsgModalDialog").modal('show');
            if(searchText == ""|| searchText==undefined){
                searchParam = '"Keywords":[],';
            }else{
                searchText = searchText.replace(/\s\s+/g, ' ');
                searchText = searchText.replace(/(\r\n\t|\n|\r\t)/g,"");
                searchText = searchText.split(' ');
                searchText = searchText.filter(v=>v!='');
                searchParam = '"Keywords":' + JSON.stringify(searchText) + ',';
            }

            if(this.icon != "" ){
                iconParam = '"HasIcon":'+this.icon+',';
            }else{
                iconParam = "";
            }
            
            if(this.image != "" ){
                imageParam = '"HasImage"'+":"+this.image+',';
            }else{
                imageParam ="";
            }
            
            if(this.conceptArray.length == 0){
                constructParam = "";
            }else{
                constructParam = '"Constructs":'+ JSON.stringify(this.conceptArray) +",";
            }
            

            if(this.visualstyle == ""||this.visualstyle==undefined){
                visualstyleParam = "";
            }else{
                visualstyleParam = '"VisualStyle":["'+this.visualstyle +'"],';
            }

            if(this.content == ""||this.content==undefined){
                contentParam = ""; 
            }else{
                contentParam = '"Content":["'+this.content +'"],'; 
            }

            if(this.enabled == true || this.enabled == "true"){
                enabledParam = '"Enabled"'+":["+false+'],';
            }else{
                enabledParam = "";
            }
            
            for(let i=0;i<this.nodesArray.length;i++){
                if(this.nodesArray[i] != '?'){
                    this.nodeSearchArray.push(this.nodesArray[i]);
                }
            }
            this.nodeSearchArray.sort(function(a, b){return a-b});
            if(this.nodesArray.indexOf("?")> -1){
                nodeExcludeParam="";                
            }else{
                nodeExcludeParam='"ExcludeSlidesWithUnknownNodes"'+":"+true+',';
            }
            
            if(this.nodeSearchArray.length !=0){
                if(this.nodeAllAny == true || this.nodeAllAny== "true"){
                    nodeParam = '"NodesAll"'+":["+ this.nodeSearchArray +"],";
                }else{
                    nodeParam = '"NodesAny"'+":["+ this.nodeSearchArray +"],";
                }
            }else{
                nodeParam="";
            }
            this.queryJson = searchParam + iconParam + imageParam + constructParam + visualstyleParam + contentParam + enabledParam + nodeParam + nodeExcludeParam;
            this.queryJson = this.queryJson.slice(0, -1);     //  Removing comma at the end
            this.queryJson = '{"queryJson":{' + this.queryJson + '}}';
        }

        var rowCount = this.rowCount;
        var columnCount = this.getColumnCount();
        count = columnCount * rowCount;
        $("#showMsgModalDialog").modal('hide');
        this.searchService.searchSlides(this.queryJson, count)
        .subscribe(slideQueryResult => {
            $("#showMsgModalDialog").modal('hide');
            this.nodeVisible = false;
            this.getSearchResults(slideQueryResult);
            this.getServerTimeStatus(slideQueryResult);
        },
        (err)=>{
            $("#showMsgModalDialog").modal('hide');
            $("#showMsgModal").modal('show');            
            this.popUpAlert = true;
            this.popUpmessage = err;
            this.noErrorRatingPopup = true;
        });
    }

    getSearchResults(slideQueryResult){
        this.searchResults = slideQueryResult.results;
        console.log(this.searchResults);
        $("#showMsgModalDialog").modal('hide');
        for(let i=0; i<this.searchResults.results.length;i++){
            if(this.searchResults.results[i].myRating == null){
                this.searchResults.results[i].myRating = "-";
            }
            this.searchResults.results[i].imageFile = setting.APIURL+this.searchResults.results[i].imageFile;
            this.searchResults.results[i].pptxFile = setting.APIURL+this.searchResults.results[i].pptxFile;
        }        
        if(slideQueryResult.results.count == 0){
            this.constructsHome = true;
        }else{
            this.constructsHome = false;
        }        
        this.nextPageUrl = slideQueryResult.results.next;
        this.tempSuggest = false;
        this.resultCount = true;
        $("#list").html("");
    }

    getServerTimeStatus(slideQueryResult){
        var serverStatus = slideQueryResult["CallProfile"];
         var serverTime= serverStatus.MilliSeconds;
         this.serverTime = Math.round(serverTime *100)/100;
        this.serverTimeStatus = serverStatus;
        $("#list").html("");
    }

    /*
    * insertFileIntoDeck()        insertFileIntoDeck()  is used to insert the file into the deck
    * @param   slide is the parameter which passed the .pptx link as paramString and API call takes place,
    */
    async insertFileIntoDeck(slide:any, index:any)
    {
        this.slideIndex = index;
        this.rateSlideId = slide.id;
        this.insertCount = this.ratingPopupForDownloads("insertCount");
        this.rateCount = localStorage.getItem("rateCount");
        var rating =  slide.myRating;
        this.popUpAlert = true;
        this.popUpmessage = "Slide Insertion in progress";
        $("#showMsgModal").modal('show');
        if(rating == "-"){
            this.yesRatingPopup = true;
            this.noRatingPopup = false;
            this.noErrorRatingPopup = false;
            this.insertPopup = true;
            this.downloadPopup = false;
            await this.insertToDeck(slide, true);
        }else{
            this.yesRatingPopup = false;
            this.noRatingPopup = true;
            this.noErrorRatingPopup = false;
            this.downloadPopup = false;
            this.insertPopup = false;
            await this.insertToDeck(slide, false);
        }
    }

    async insertToDeck(slide, insertStatus)
    {
        //Check Version
        const api = new VstoHelperApi(this.http);
        var serverVersion = await api.GetVersion();
        console.log(serverVersion, setting.VstoVersion);
        if(serverVersion === '0')
        {
            //show error
            setTimeout(() => {
                this.popUpAlert = true;
                this.popUpmessage = 'Could not connect with helper plugin. Please ensure that PowerPoint is running on local machine and <a href="/assets/VstoHelper-Installer-v' + setting.VstoVersion + '.msi">helper VSTO plugin</a> is already installed';
                $("#showMsgModal").modal('show');
            }, 3000);
        }
        else if(serverVersion === setting.VstoVersion){
            console.log("True");
            var slideBase64;
            await this.getBase64FromUrl(slide.pptxFile)
            .then(result => 
            {
                var res = JSON.stringify(result);
                slideBase64 = res.replace("data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,","");
                let headers = new Headers({'Content-Type': 'application/json'});
                let options = new RequestOptions({ headers: headers });
                var min=slide.node_start;
                var node=[];
                if(this.nodeSearchArray.length!=0){
                    for(let i=0;i<this.nodeSearchArray.length;i++){
                        node.push(this.nodeSearchArray[i] - min + 1);
                    }
                }            
                if(min==null || this.nodeSearchArray.length == 0){
                    var params = '{"File":'+slideBase64+'}';   
                }else{
                    var params = '{"File":'+slideBase64+', "slideIndices":['+node +"]}";
                }

                this.http.post('https://localhost:1234/insertSlide', params, options)
                .map(res =>
                {
                    this.updateDownloadCount(slide.id, slide.downloads);
                    this.popUpAlert = true;
                    this.popUpmessage = res.text();
                    $("#showMsgModal").modal('show');
                    if(insertStatus == false){
                        setTimeout(() => {
                            $("#showMsgModal").modal('hide');
                        }, 1000);
                    }
                })
                .subscribe(
                res => {
                    console.log(res);
                },
                error => {
                    setTimeout(() => {
                        this.popUpAlert = true;
                        this.popUpmessage = error;
                        $("#showMsgModal").modal('show');
                    }, 3000);
                });
            }).catch(err => console.error(err));
        } else {
            //show error
            setTimeout(() => {
                this.popUpAlert = true;
                this.popUpmessage = 'You have an old version of helper plugin. Please download latest version <a href="/assets/VstoHelper-Installer-v' + setting.VstoVersion + '.msi">helper VSTO plugin</a>';
                $("#showMsgModal").modal('show');
            }, 3000);
        }
    }
    async getBase64FromUrl(imageUrl) {
        var res = await fetch(imageUrl);
        var blob = await res.blob();
        return new Promise((resolve, reject) => {
            var reader  = new FileReader();
            reader.addEventListener("load", function () {
                resolve(reader.result);
            }, false);
            reader.onerror = () => {
                return reject(this);
            };
            reader.readAsDataURL(blob);
        })
    }

    /*
    * download()
    * @param   url is the parameter which passed the link for .pptx file to download,
    */
    download(slideId:any, url:any, count:any, index:any, rating:any){
        this.slideIndex =index;
        this.rateSlideId = slideId;
        this.downloadCount = this.ratingPopupForDownloads("downloadCount");
        this.rateCount = localStorage.getItem("rateCount");
        if(rating == "-"){
            this.yesRatingPopup = true;
            this.noRatingPopup = false;
            this.noErrorRatingPopup = false;
            this.downloadPopup = true;
            this.insertPopup = false;
        }else{
            this.yesRatingPopup = false;
            this.noRatingPopup = true;
            this.noErrorRatingPopup = false;
            this.downloadPopup = false;
            this.insertPopup = false;
        }
        this.downloadFile(url);
        this.updateDownloadCount(slideId, count);
    }

    downloadFile(url){
        var link = document.createElement("a");
        link.download = "a";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        this.popUpAlert = true;
        this.popUpmessage = "File is downloading";
        $("#showMsgModal").modal('show'); 
    }

    updateDownloadCount(slideId, count){
        count +=1;
        var downloadUrl = setting.APIURL+"/search/results/"+slideId+"/";
        var downloadCount = '{"downloads":' + count +'}';
        $("#showMsgModal").modal('hide'); 
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        this.http.patch(downloadUrl, downloadCount, options).subscribe(res=>{
            $("#showMsgModal").modal('hide'); 
        },
        (err)=>{
            this.popUpAlert = true;
            this.popUpmessage = err;
            $("#showMsgModal").modal('show');
        })
    }

    /*
    * closePopUp()   function used to close the pouUpAlert,
    */
    closePopUp(){
        this.popUpAlert = false;
    }

    /*
    * changeRating()      changeRating() function is used the up and down rate the slide by the user,
    */
    changeRating(index:number,rating:any, slideId:any, upVoteKind:boolean)
    {
        console.log(index, rating, slideId, upVoteKind);
        if(rating == "-"){
            rating=0;
            var rateCount = localStorage.getItem("rateCount");
            if(rateCount == null || rateCount == "null"){
                this.rateCount = 0;
                localStorage.setItem("downloadCount", this.rateCount);
                localStorage.setItem("insertCount", this.rateCount);
                localStorage.setItem("rateCount", this.rateCount);
            }else{
                this.rateCount = parseInt(rateCount) + 1;
                localStorage.setItem("rateCount", this.rateCount);
            }
        }
        var newRating;
        if(upVoteKind == true){
            newRating = rating + 1;
        }
        else{
            newRating = rating - 1;
        }
        newRating = Math.min(Math.max(newRating, -3), 3);
        this.searchService.ratingSlides(newRating, slideId)
        .subscribe(slideQueryResult => {
            this.searchResults.results[index].myRating = newRating;
        },
        (err)=>{
            this.popUpAlert = true;
            this.popUpmessage = err;
            $("#showMsgModalDialog").modal('show');
        });
    }

    /*
    * authenticate()      authenticate() function is used the authenticate the user for voting the slide,
    */
    authenticate(){
        this.searchService.authenticate("authenticate")
        .subscribe(data => {
            data => {
                var resultMessage="Authenticated successfully";
                this.resetClick();
                this.homepage();
				this.popUpAlert = true;
                this.popUpmessage = resultMessage;
                $("#showMsgModal").modal('show');
            }
        },
        (err)=>{
           this.popUpAlert = true;
           this.popUpmessage = err;
           $("#showMsgModal").modal('show');
        });
    }

    /*
    * constructClick()      constructClick() function takes API call when user clicks the constructs from the Template section
    * @params   searchText param passes the keyword entered in the Search keyword
    *           constructId  param passes the selected constructID in array format
    */
    constructClick(searchText:any, constructId:any){
        var searchParam;
        if(searchText == ""|| searchText==undefined){
            searchParam = '"Keywords":[],';
        }else{
            searchParam = '"Keywords":["' + searchText + '"],';
        }
        var constructParam = '"Constructs":['+constructId +"]";
        this.queryJson = searchParam + constructParam;
        this.queryJson = '{"queryJson":{' + this.queryJson + '}}';
        this.popUpAlert = true;
        this.popUpmessage = "Searching";
        $("#showMsgModalDialog").modal('show');

        var columnCount = this.getColumnCount();
        var rowCount = this.rowCount; 
        var count = columnCount * rowCount;
        this.searchService.searchSlides(this.queryJson, count)
        .subscribe(slideQueryResult => {
            this.getSearchResults(slideQueryResult);
            this.getServerTimeStatus(slideQueryResult);
            
        },
        (err)=>{
            this.popUpAlert = true;
            this.popUpmessage = err;
            $("#showMsgModalDialog").modal('hide');
            $("#showMsgModal").modal('show');
            this.noErrorRatingPopup = true;
        });
    }

    /*
    * homepage()      homepage() function navigates to homePage
    */
    homepage(){
        this.tempSuggest = true;
        this.resultCount = false;
        this.constructsHome = true;
        this.searchResults = [];
        this.queryJson = "";
        this.nextPageUrl = "";
    }

    /*
    * conceptClick()      conceptClick() function to display the concept and construct in hierarychy view
    */
    conceptClick(){
        this.conceptVisible = !this.conceptVisible;
    }

    /*
    * conceptItemClick()      conceptItemClick() function to display the concept and construct in hierarychy view
    * @params       id param is passed in the function which pushed in the array and displayed
    *               eventValue param is boolean values which used to get the value if the item is checked or not
    */
    conceptItemClick(id:any,name:any, eventValue:any,ind:any)
    {
        if(eventValue.target.checked == true){
            this.conceptArray.push(id);
            this.conceptNameArray.push(name);
        }else{
            var index =  this.conceptArray.indexOf(id);
            if(index === -1){
                this.conceptArray.push(id);
                this.conceptNameArray.push(name);
            }else{
                this.conceptArray.splice(index,1);
                this.conceptNameArray.splice(index,1);
            }
        }
        if(this.conceptArray.length == 0){
            this.conceptDropdownDisplayText = "All Constructs";
        }else{
            this.conceptDropdownDisplayText = JSON.stringify(this.conceptNameArray);
        }
    }

    getItem(id:any){
        let resultStatus = this.conceptArray.some(x => x === id);
        return resultStatus;
    }

    logout(){
        this.authService.logout();
    }

    viewEdit(slideId, id, friendlyId, index){
        $("#showImageDialog").modal('hide');
        this.slideEdit.viewEdit(slideId, id, friendlyId, index);
    }

    constructItemClickModal(concept:any, construct:any, id:any){
        this.slideEdit.constructClickModal(concept, construct, id);
    }

    constructClickModal(){
        this.slideEdit.constructClickModal();
    }

    cancelView(){
        this.slideEdit.cancelView();
    }

    singleSlideAddTagClick(tag){
        this.slideEdit.singleSlideAddTagClick(tag);
    }

    tagsRemoveClick(tagName, tagId){
        this.slideEdit.tagsRemoveClick(tagName, tagId);
    }

    singleSlideSubmitClick(slideId, slideIndex){
        this.slideEdit.singleSlideSubmitClick(slideId, slideIndex);
    }

    deleteSlide(slideId){
        this.slideEdit.deleteSlide(slideId);
    }

    okDisableDialogClick(){
        this.slideEdit.okDisableDialogClick();
    }

    noConfirmDialog(){
        this.slideEdit.noConfirmDialog();
    }

    yesConfirmDialog(slideId){
        this.slideEdit.yesConfirmDialog(slideId);
    }

    uploadSelectedSlides(){
        this.slideEdit.uploadSelectedSlides();
    }

    uploadFiles(){
        this.slideEdit.uploadFiles();
    }

    noChange(){
        this.slideEdit.noChange();
    }

    onChangePptx(event){
        this.slideEdit.onChangePptx(event);
    }
    
    onChangeImage(event){
        this.slideEdit.onChangeImage(event);
    }

    smileyClick(id, slideIndex, rateSlideId)
    {
        console.log(id, slideIndex, rateSlideId);
        this.ratingPopUp = false;
        $("#showMsgModal").modal('hide');
        for(let i=0; i< this.smileySet.length; i++){
            if(i == id){
                this.smileySet[i].active = 1;
            }else{
                this.smileySet[i].active = 0;
            }
        }
        for(let i=0; i< this.smileySet.length; i++){
            if(this.smileySet[i].active == 1){
                var rating = this.smileySet[i].value;
            }
        }
        this.changeSmileyRating(slideIndex, parseInt(rating), rateSlideId);
        this.getSmileyIconValue();
    }

    changeSmileyRating(index, newRating, slideId)
    {
        var rateCount = localStorage.getItem("rateCount");
        if(rateCount == null || rateCount == "null"){
            this.rateCount = 0;
            localStorage.setItem("downloadCount", this.rateCount);
            localStorage.setItem("insertCount", this.rateCount);
            localStorage.setItem("rateCount", this.rateCount);
        }else{
            this.rateCount = parseInt(rateCount) + 1;
            localStorage.setItem("rateCount", this.rateCount);
        }
        
        this.searchService.ratingSlides(newRating, slideId)
        .subscribe(slideQueryResult => {
            this.searchResults.results[index].myRating = newRating;
        },
        (err)=>{
            this.popUpAlert = true;
            this.popUpmessage = err;
            $("#showMsgModalDialog").modal('hide');
        });
    }

    getSmileyIconValue(){
        this.smileySet = [
            {"active":0,"path":"../../assets/icons/smiley7.png", "value":"3"},{"active":0,"path":"../../assets/icons/smiley6.png", "value":"2"},{"active":0,"path":"../../assets/icons/smiley5.png", "value":"1"},
            {"active":1,"path":"../../assets/icons/smiley4.png", "value":"0"},{"active":0,"path":"../../assets/icons/smiley3.png", "value":"-1"},{"active":0,"path":"../../assets/icons/smiley2.png", "value":"-2"},
            {"active":0,"path":"../../assets/icons/smiley1.png", "value":"-3"}];
    }

    ratingCountValue:any;
    ratingPopupForDownloads(ratingCount:any){
        var ratingCountValue = localStorage.getItem(ratingCount);
        if(ratingCountValue == null || ratingCountValue == "null"){
            this.ratingCountValue = 0;
            localStorage.setItem("insertCount", this.ratingCountValue);
            localStorage.setItem("downloadCount", this.ratingCountValue);
            localStorage.setItem("rateCount", this.ratingCountValue);
        }else{
            this.ratingCountValue = parseInt(ratingCountValue) + 1;
            localStorage.setItem(ratingCount, this.ratingCountValue);
        }
        return localStorage.getItem(ratingCount);
    }

    selectedRow(){
        this.advancedSearchClick(this.searchText, false);
    }

    myRatingClick(){
        this.ratingPopUp = !this.ratingPopUp;
    }

    browserClick(){
        var uri = window.location.href+"?query="+ encodeURIComponent(this.queryJson);
        window.open(uri,'_blank','height=' + screen.height + ',width=' + screen.width + ',resizable=yes,scrollbars=yes,toolbar=yes,menubar=yes,location=yes');
    }

    getColumnCount(){
        var rowWidth = document.getElementById('browserwrapper').clientWidth;
        var columnWidth = document.getElementById('slide_list_new').clientWidth;
        var columnCount = Math.round(rowWidth/columnWidth);
        return columnCount;
    }

    rateLater(){
        $("#showMsgModal").modal('hide');
    }
    
    breakUpClick(breakUpTime)
    {
        this.myarray=[];
        if($("#list:visible").length > 0 ){
            $(".breakUpToggle").hide();
        }else{
            $(".breakUpToggle").show();
        }
        this.renderJson(breakUpTime);
        this.myarray.push("<ul>");
        $("#list").html(this.myarray.join(""));
    
        $('#list span').click(function(){
            $(this).parent("li").toggleClass("expand");
            $(this).toggleClass("expand-span");     
            $(".currentclicked").removeClass("currentclicked");
            $(this).parent().addClass("currentclicked");
            $(".currentclicked > ul").slideToggle();
        })
    
        $('ul li > ul').prev("span").addClass('collpse-span');
        setTimeout(function(){
        $( ".collpse-span" ).before( '<div class="collpse-before-div"></div>' );
        }, 100);
    }

    myarray = ["<ul>"];
    renderJson(items) 
    {
        switch ($.type(items)) {
            case "object":
                this.renderObject(items);
                break;
            case "string":
                this.myarray.push(" : " + items + "");
                break;
            case "number":
                this.myarray.push(" : " + Number(items) + "");
                break;
            case "array":
                this.renderArray(items);
                break;       
        }     
    }

    renderObject(parent) {
        this.myarray.push("<ul class='collapsibleList'>");
        for(var child in parent) {
            this.myarray.push("<li><span>" + child + "</span>");
            this.renderJson(parent[child]);
            this.myarray.push("</li>");
        }
        this.myarray.push("</ul>");
    }

    renderArray(myArray){
        this.myarray.push("<ul>");
        for(var childobj in myArray){
            this.myarray.push("<li><span>" + childobj + "</span>");
            this.renderJson(myArray[childobj]);
            this.myarray.push("</li>");
        }
        this.myarray.push("</ul>");
    }    

    whatsnewArray:any=[];
    whatsnewPopup(){
        this.whatsNew();
        $("#showWhatsNewDialog").modal('show');
        this.searchService.getWhatsnew()
        .subscribe(whatsNewApiArray => {
            whatsNewApiArray = this.prefixData(whatsNewApiArray);
            this.whatsnewArray = this.whatsnewArray.concat(whatsNewApiArray);
            for(let whatsNewObject of this.whatsnewArray){
                whatsNewObject["date"] = new DatePipe("en-US").transform(whatsNewObject["date"], "yyyy/MM/dd");
            }
            this.sortWhatsNewByDate();
            $("#showWhatsNewDialog").modal('show');
        });
    }
    prefixData(arr){
        var jsonArray=[];
        for(let i=0; i<arr.length; i++){
            var dateFormat = arr[i].date.split("/");
            jsonArray.push(
            {
                "title" : "["+arr[i].bucket+"] " +arr[i].title, 
                "date" : dateFormat[2]+"/"+dateFormat[1]+"/"+dateFormat[0], 
                "description" : arr[i].description,
                "dateFormat": dateFormat[0]+"/"+dateFormat[1]+"/"+dateFormat[2]
            });
        }
        return jsonArray;
    }

    whatsNew(){
        this.whatsnewArray=[];
        this.http.get('assets/whatsnew.json').subscribe(data=>{
            this.whatsnewArray = data.json();
            this.whatsnewArray = this.prefixData(this.whatsnewArray);
            this.sortWhatsNewByDate();
        }); 
    }
    sortWhatsNewByDate(){
        var whatsNewDate1, whatsNewDate2;
        this.whatsnewArray.sort(function(whatsNewObj1, whatsNewObj2){
            whatsNewDate1=new Date(whatsNewObj1.date), whatsNewDate2=new Date(whatsNewObj2.date)
            return whatsNewDate2-whatsNewDate1;
        });
    }
    
    @HostListener('document:keydown', ['$event'])
    keydown(e: KeyboardEvent) {
        if(e.keyCode == 27){
            $("#showWhatsNewDialog").modal('hide');
            $("#showInfoDialog").modal('hide');
            $("#showSingleViewEditModal").modal('hide');
        }
    }

    nodeClick(){
        this.nodeVisible =!this.nodeVisible;
    }
    
    nodeItemClick(id,name, event, nodeindex){
        this.nodesValue="";
        if(event.target.checked == true){
            this.nodesArray.push(id);
            this.myOptions[nodeindex].status=true;
        }else{
            var index =  this.nodesArray.indexOf(id);
            if(index === -1){
                this.nodesArray.push(id);
                this.myOptions[nodeindex].status=true;
            }else{
                this.nodesArray.splice(index,1);
                this.myOptions[nodeindex].status=false;
            }
        }
        var nodesValue =JSON.stringify(this.nodesArray);
        if(this.nodesArray.length == 0){
            this.nodesValue="Nodes";    
        }else{
            nodesValue = nodesValue.replace("[", "Nodes(");
            this.nodesValue = nodesValue.replace("]", ")");
        }
    }
}