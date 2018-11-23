import { Component } from '@angular/core';
import { setting } from './settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public resultPanelText: any;
  public isLoggedIn: boolean = false;
  constructor(){
    this.setToggleButtonMode();
  }

  ngOnInit() {}
  
  setToggleButtonMode(){
    var uri = document.location.href;
    var APIUrl;
    if(uri.includes("lisa-dev")){
      APIUrl = setting.DEVURL;
      setting.interfaceMode = "lisadev";
    }else if(uri.includes("lisa-prod")){
      APIUrl = setting.PRODURL;
      setting.interfaceMode = "lisaprod";
    }else{
      APIUrl= setting.LOCALHOSTURL;
      setting.interfaceMode = "localhost";       
    }
    setting.APIURL = APIUrl;
  }
}
