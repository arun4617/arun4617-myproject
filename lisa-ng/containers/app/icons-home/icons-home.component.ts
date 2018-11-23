import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { setting } from '../settings';

@Component({
    templateUrl: './icons-home.component.html',
    styleUrls: ['./icons-home.component.css']
})

/* 
 * @package icons-home
 * 
 * IconsHomeComponent    ICONSHOMECOMPONENT is the screen which displays the template category section,
 */
export class IconsHomeComponent {
    useremail:any;
    constructor(private authService: AuthService) { 
        this.useremail = setting.UserEmail;
    }
    /*
     * ngOnInit()   ngOnInit IS CALLED RIGHT AFTER THE DIRECTIVE'S DATA-BOUND PROPERTIES HAVE BEEN CHECKED FOR THE FIRST TIME, AND BEFORE ANY OF ITS CHILDREN HAVE BEEN CHECKED. NGONINIT IS INSTIATED TO GET THE toggleDevProd AND APIURL FORM footerGlobal.ts
     */
    ngOnInit() {
    }

    logout(){
        this.authService.logout();
    }
}