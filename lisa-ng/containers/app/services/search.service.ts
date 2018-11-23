import { Injectable } from '@angular/core';
import { Slide } from '../slide';
import { SLIDES } from '../mock-slides';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Http, RequestOptions, Headers } from '@angular/http';
import { SlideQueryResult } from '../slideQueryResult';
import {setting} from '../settings';

/*
 * @package   service
 * SearchService   SearchService is the service which handles api call
 */
@Injectable()
export class SearchService {

  APIurl:string;
  csrf:any; 
  /*
   * Constructor: Called when class is instantiated.
   */
  constructor(private http: Http) { }

  /*
   * getSlides()   getSlides() Is used to get the results stored in the mock-slides
   * @return   Returns the result as Array
   */ 
  getSlides(construct: number): Observable<Slide[]> {
    return of(SLIDES);
  }
  
  /*
   * loadSearchResults()   loadSearchResults() method is used to handle api call for next and previous, 
   *
   * @param    url:string is the parameter contains the url which call the webservice
   * @return   returns the result from webservice in array format
   */ 
  loadSearchResults(url: string): Observable<SlideQueryResult> {
    return this.http
      .get(url)
      .map(res => res.json());
  }

  /*
   * getConstructs()   getConstructs() method is used to handle api call get the Constructs in the Advanced search template, 
   *
   * @return   returns the result from webservice in array format
   */ 
  getConstructs(){
    this.APIurl = setting.APIURL;
    //Add API URL 
    let url = this.APIurl + "/slidedb/constructs/";
    // api call takes place here with url, parameters and headers
    return this.http
      .get(url)
      .map(result => result.json().results);
  }

   /*
   * getConcepts()   getConcepts() method is used to handle api call get the Concepts in the Home page, 
   *
   * @return   returns the result from webservice in array format
   */ 
  getConcepts(){
    this.APIurl = setting.APIURL;
    //Add API URL 
    let url = this.APIurl + "/slidedb/concepts/";
    // api call takes place here with url, parameters and headers
    return this.http
      .get(url)
      .map(result => result.json().results);
  }

  /*
   * searchSlides()   searchSlides() method is used to handle api call for filter, 
   *
   * @param    query: String     parameter contains the search queryJson value which passed as the parameter,
   * @return   returns the result from webservice in JSON format
   */ 
    searchSlides(query: String, noOfRecords: number): Observable<SlideQueryResult> {
      this.APIurl = setting.APIURL;
        let baseUrl = this.APIurl + "/search/";
        let paramsString = query;
        let url = baseUrl + "queries/?page_size="+noOfRecords;
        this.csrf = this.getCookie("csrftoken");
        let headers = new Headers({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json', 
            'X-CSRFToken': this.csrf
            });  

        let options = new RequestOptions({ headers: headers });
        // api call takes place here with url, parameters and headers
        console.log("url",url);
        return this.http
          .post(url, paramsString, options)
          .map(res => res.json());
  }

  /*
   * ratingSlides()   ratingSlides() method is used to handle rating api call by the user, 
   *
   * @param     rating: any     parameter contains the rating value which passed as the parameter,
   *            resultId: any     parameter contains the id of the slide which passed as the parameter,
   */ 
  ratingSlides(rating:any, resultId:any)
  {

	  let headers = new Headers({
  		'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json', 
      'X-CSRFToken': this.csrf
    });
    let options = new RequestOptions({
      headers: headers
    });
    let paramsString = '{"rated":' + rating + ',"result":'+ resultId +'}';
    return this.http.post(this.APIurl+'/search/ratings/', paramsString, options)
  		.map(res => {
        return res.text();
      });
	  
  }

  /*
   * getCookie()    getCookie() method is used to find the selected cookie value, 
   *
   * @param     name: any     parameter contains the name of the cookie which passed as the parameter to get the cookie,
   */ 
  getCookie(name:any) 
  {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) 
      return parts.pop().split(";").shift();
  }

  /*
   * authenticate()    authenticate() method is used to authenticate the selected user to get logged in using valid credentials
   */ 
  authenticate(auth:any)
  {
    //Add API URL
    this.APIurl = setting.APIURL;
    this.csrf = this.getCookie('csrftoken');
    localStorage.setItem("csrf", this.csrf);
  	let paramsString = "csrfmiddlewaretoken="+this.csrf+"&next=%2F";
	  let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded' 
  	});
	  let options = new RequestOptions({ headers: headers });
	  // api call takes place here with url, parameters and headers
	  return this.http
      .post(this.APIurl+"/login/", paramsString, options)
      .map(res => {
        return res.text();
      });
  }
  
  /*
  * getUsageDetails()    getUsageDetails() method is used to get the usage details for last week
  */
  getUsageDetails(startDay, endDay){
    this.APIurl = setting.APIURL;
    let url = this.APIurl + "/search/users/?startDay="+startDay+"&endDay="+endDay;
    return this.http
      .get(url)
      .map(result => result.json());
  }

  getWhatsnew(){
    this.APIurl = setting.APIURL;
    //Add API URL 
    let url = this.APIurl + "/whats-new";
    // api call takes place here with url, parameters and headers
    return this.http
      .get(url)
      .map(result => result.json());
  }

  deleteCookie()
  {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  getUserDetail(){
    this.APIurl = setting.APIURL;
    //Add API URL 
    let url = this.APIurl + "/account";
    // api call takes place here with url, parameters and headers
    return this.http
      .get(url)
      .map(result => result.json());
  }
} 
