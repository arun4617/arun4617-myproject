import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { setting } from '../settings';
import 'rxjs/add/observable/throw';
import { VstoHelperApi } from '../VstoHelperApi';
import { SearchHomeComponent } from '../search-home/search-home.component';

declare var $: any;
/*
* slideViewEditComponent    slideViewEditComponent is the pop-up screen to display the slide detail, 
*/
export class slideViewEditComponent{
    constructor(public SearchHomeComponent: SearchHomeComponent, public http: Http){}

    viewEdit(slideId, id, friendlyId, slideIndex){
        this.SearchHomeComponent.values = [0, 0];
        this.SearchHomeComponent.imageFile="";
        this.SearchHomeComponent.slideFile="";
        $("#showSingleViewEditModal").modal('show');        
        this.http.get(setting.APIURL+"/slidedb/slides/"+slideId+"/")
        .subscribe(res =>{
            console.log(res.json());
            var result = res.json();
            this.SearchHomeComponent.slideImage = result.imageFile;
            this.SearchHomeComponent.hasIcon = result.hasIcon;
            this.SearchHomeComponent.hasImage = result.hasImage;
            this.SearchHomeComponent.style = result.style;
            this.SearchHomeComponent.layout = result.layout;
            this.SearchHomeComponent.viewContent = result.content;
            this.SearchHomeComponent.viewEnabled = result.enabled;
            this.SearchHomeComponent.tags = result.tags;
            this.SearchHomeComponent.parent = result.parent;
            this.SearchHomeComponent.slideId = slideId;
            this.SearchHomeComponent.friendlyId = friendlyId;
            this.SearchHomeComponent.indexId = id;
            this.SearchHomeComponent.slideIndex = slideIndex;
            console.log(this.SearchHomeComponent.parent);
            if(result.node_start == null){
                this.SearchHomeComponent.nodeStart =0;    
            }else{
                this.SearchHomeComponent.nodeStart = result.node_start;
            }
            if(result.node_end == null){
                this.SearchHomeComponent.nodeCount =0;    
            }else{
                this.SearchHomeComponent.nodeCount = result.node_end - result.node_start;
            }
            this.SearchHomeComponent.http.get(result.parent).subscribe(construct=>{
                var cons = construct.json();
                this.SearchHomeComponent.construct = cons.name;
                this.http.get(cons.parent).subscribe(res2=>{
                    var concept = res2.json();
                    this.http.get(concept.parent).subscribe(res3=>{
                        var concept = res3.json();
                        this.SearchHomeComponent.concept = concept.name;
                    })
                })

            })
        })
    }

    /*
    * constructItemClickModal   function is called when concept is clicked in the dialog
    * @params   concept  which contains the concept value from the dialog view
    *           construct  which contains the construct value from the dialog view
    *           id  which contains the construct id
    */ 
    constructItemClickModal(concept:any, construct:any, id:any){
        this.SearchHomeComponent.parent = setting.APIURL+"/slidedb/constructs/"+id+"/";
        this.constructClickModal();
        this.SearchHomeComponent.construct = construct;
        this.SearchHomeComponent.concept =concept;
    }
    
    // constructClickModal   function is used to enable and disable the construct and concept list
    constructClickModal(){
        this.SearchHomeComponent.constructVisibleModal = !this.SearchHomeComponent.constructVisibleModal;
    }

    cancelView(){
        $("#showSingleViewEditModal").modal('hide');
    }

    singleSlideAddTagClick(tag)
    {
        tag = tag.replace(/[\s]/g, '');
        tag = tag.split(';');
        tag=  tag.filter(v=>v!='');
        console.log("tags",tag);
        for(let ta of tag){
            if(this.SearchHomeComponent.tags.indexOf(ta) == -1){
                this.SearchHomeComponent.tags.push(ta);
            }
        }   
        this.SearchHomeComponent.addTagValue="";
    }

    tagsRemoveClick(tagName, tagId){
        const index: number = this.SearchHomeComponent.tags.indexOf(tagName);
        this.SearchHomeComponent.tags.splice(index, 1);
    }

    singleSlideSubmitClick(slideId, slideIndex){
        const formData: FormData = new FormData();
        formData.append('enabled', this.SearchHomeComponent.viewEnabled);
        if(this.SearchHomeComponent.imageFile != ""){
            formData.append('imageFile', this.SearchHomeComponent.imageFile, this.SearchHomeComponent.filenamejpg);
        }
        if(this.SearchHomeComponent.slideFile != ""){
            formData.append('pptxFile', this.SearchHomeComponent.slideFile, this.SearchHomeComponent.filenamepptx);
        }
        formData.append('parent', this.SearchHomeComponent.parent);
        formData.append('tags', JSON.stringify(this.SearchHomeComponent.tags));
        formData.append('hasIcon', this.SearchHomeComponent.hasIcon);
        formData.append('hasImage', this.SearchHomeComponent.hasImage);
        formData.append('layout', this.SearchHomeComponent.layout);
        formData.append('style', this.SearchHomeComponent.style);
        formData.append('content', this.SearchHomeComponent.viewContent);
        if(this.SearchHomeComponent.nodeStart != 0 && this.SearchHomeComponent.nodeCount != 0){
            formData.append('node_start', this.SearchHomeComponent.nodeStart);
            var nodeEnd = this.SearchHomeComponent.nodeStart + this.SearchHomeComponent.nodeCount;
            formData.append('node_end', nodeEnd);        
        }
        let headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        let body = formData;
        let options = new RequestOptions();
        let url = setting.APIURL+"/slidedb/slides/"+slideId+"/";
        this.http.put(url, body, options)
        .subscribe(res => 
        {
            console.log(res);
            this.cancelView();
            this.SearchHomeComponent.imageFile = "";
            var response = JSON.parse(res["_body"]);
            this.SearchHomeComponent.searchResults.results[slideIndex].imageFile = response.imageFile;
            this.SearchHomeComponent.searchResults.results[slideIndex].content = response.content;
            this.SearchHomeComponent.searchResults.results[slideIndex].enabled = response.enabled;
            this.SearchHomeComponent.searchResults.results[slideIndex].hasIcon = response.hasIcon;
            this.SearchHomeComponent.searchResults.results[slideIndex].hasImage = response.hasImage;
            this.SearchHomeComponent.searchResults.results[slideIndex].layout = response.layout;
            this.SearchHomeComponent.searchResults.results[slideIndex].node_end = response.node_end;
            this.SearchHomeComponent.searchResults.results[slideIndex].node_start = response.node_start;
            this.SearchHomeComponent.searchResults.results[slideIndex].parent = response.parent;
            this.SearchHomeComponent.searchResults.results[slideIndex].pptFile = response.pptFile;
            this.SearchHomeComponent.searchResults.results[slideIndex].pptxFile = response.pptxFile;
            this.SearchHomeComponent.searchResults.results[slideIndex].style = response.style;
            this.SearchHomeComponent.searchResults.results[slideIndex].tags = response.tags;
            this.SearchHomeComponent.searchResults.results[slideIndex].thumbnailFile = response.thumbnailFile;
            this.SearchHomeComponent.searchResults.results[slideIndex].visualStyle = response.visualStyle;
        },
        (err)=>{
            this.SearchHomeComponent.popUpAlert = true;
            this.SearchHomeComponent.popUpmessage = err;
            $("#showMsgModal").modal('show');
            this.SearchHomeComponent.yesRatingPopup = false;
            this.SearchHomeComponent.noRatingPopup = false;
            this.SearchHomeComponent.noErrorRatingPopup = true;
            setTimeout(() => {
                $("#showMsgModal").modal('hide');
            }, 3000);
        });
    }

    deleteSlide(slideId)
    {
        this.SearchHomeComponent.closeSlideID = slideId;
        this.http.get(setting.APIURL+"/slidedb/slides/"+slideId+"/")
        .subscribe(res =>{
            var result = res.json();
            var enabled = result.enabled;
            console.log(enabled);
            if(enabled == true){
                console.log(enabled);
                $("#showDisableDialog").modal("show");
            }else{
                $("#showConfirmDialog").modal("show");
            }
        })
    }

    okDisableDialogClick(){
        $("#showDisableDialog").modal("hide");
    }

    noConfirmDialog(){
        $("#showConfirmDialog").modal("hide");
    }

    yesConfirmDialog(slideId){
        $("#showConfirmDialog").modal("hide");
        let url = setting.APIURL+"/slidedb/slides/"+slideId+"/";
        this.http.delete(url)
        .subscribe(res => {
            console.log(res);
            $("#showSingleViewEditModal").modal('hide');
            this.SearchHomeComponent.searchResults=[];
            this.SearchHomeComponent.popUpAlert = true;
            this.SearchHomeComponent.popUpmessage = 'Slide deleted successfully';
            $("#showMsgModal").modal('show');
            setTimeout(() => {
                $("#showMsgModal").modal('hide');
            }, 3000);
        });
    }

    uploadSelectedSlides(){
        this.SearchHomeComponent.uploadFile = false;
        const api = new VstoHelperApi(this.http);
        let rnd = api.getRandomInt(1,10000);
        api.getSelectedSlides(rnd) 
        .subscribe(res => {
            var selectedID = res;
            var filename = "Slide-"+this.SearchHomeComponent.concept+"-"+this.SearchHomeComponent.construct+"-"+Date.now();
            var imageUrl = setting.UPLOAD_APIURL + "/image/" + selectedID[0] +".JPG";
            var slideUrl = setting.UPLOAD_APIURL + "/slide/" + selectedID[0] +".pptx";
            this.SearchHomeComponent.filenamejpg = filename+".JPG";
            this.SearchHomeComponent.filenamepptx = filename+".PPTX";
            this.http.get(imageUrl, {responseType: ResponseContentType.Blob})
            .subscribe(res=>{
                this.SearchHomeComponent.imageFile = new Blob([res["_body"]], {type: 'image/jpeg'});
                this.http.get(slideUrl, {responseType: ResponseContentType.Blob})
                .subscribe(res=>{
                    this.SearchHomeComponent.slideFile = new Blob([res["_body"]], {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
                })
            })
        })
    }
    
    uploadFiles(){
        this.SearchHomeComponent.uploadFile = true;
    }
    noChange(){
        this.SearchHomeComponent.imageFile="";
        this.SearchHomeComponent.slideFile="";
        this.SearchHomeComponent.uploadFile = false;
    }

    onChangePptx(event) {
        var files = event.srcElement.files;
        this.SearchHomeComponent.filenamepptx = files[0].name;
        this.SearchHomeComponent.slideFile = files[0];
    }

    onChangeImage(event) {
        var files = event.srcElement.files;
        this.SearchHomeComponent.filenamejpg = files[0].name;
        this.SearchHomeComponent.imageFile = files[0];
    }
}
