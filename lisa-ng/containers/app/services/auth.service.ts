import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as OfficeHelpers from '@microsoft/office-js-helpers';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SearchService } from './search.service';
/*
 * @package   service
 *
 * authService   authService is the service which handles authentication
 */

@Injectable()
export class AuthService {
    public dialog;
    public options;
    public postBuildSiteURL = environment.POSTBUILD_SITEURL+"/api/";
    public preBuildSiteURL = environment.PREBUILD_SITEURL;
    /*
    * Constructor: Called when class is instantiated.
    */
    constructor(private http: Http,private cookieService: CookieService, public router: Router, private searchService: SearchService) {}

    /*
    * authProccess() : Its redirect to the backend server api using provided session id.
    * params         : sessionID- string, to bind the socket channel
    * return         : none
    */
    authProccess(){
        window.location.href = this.postBuildSiteURL+"google-auth/connect";
    }

    logout(){
        this.cookieService.delete('authData');
        this.searchService.deleteCookie();
        document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue="+this.preBuildSiteURL;
    }
}