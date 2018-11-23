import { Http, RequestOptions, Headers } from '@angular/http';
import { Response } from '@angular/http';
//import {Version} from './Version';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import {setting} from './settings';

export class VstoHelperApi {

  public http: Http;
  Url: string;
  ErrorMessage: string;

  constructor(http: Http) {
    this.http = http;
    this.Url = "https://localhost:1234";
  }

  async GetVersion(): Promise<string> {
    try {
      const response = await this.http.get(this.Url).toPromise().catch();
      return response.json().version as string;
    }catch (e) {
      console.log(e);
      return '0';
    }
  }

  res:any;
  getSelectedSlides(ran){
    let url = setting.UPLOAD_APIURL+"/listSelected?" + ran;
    return this.http
      .get(url)
      .map(result => {
       return  result.json();
      });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
  }

}
