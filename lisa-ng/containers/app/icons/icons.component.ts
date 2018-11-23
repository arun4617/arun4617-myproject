import { Component } from '@angular/core';
import { Icon } from '../icon';
import { IconService } from '../services/icon.service';
import { setting } from '../settings';

@Component({
    selector: 'app-icons',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.css']
})

/* 
 * @package icons
 * 
 * IconsComponent    IconsComponent is the screen which displays the icons section in the icons page
 * 
 */
export class IconsComponent {
    icons: Icon[];

    /*
     * Constructor: Called when class is instantiated.
     *
     * @param     iconService is used to get the icon details of the iconUrl
     */  
    constructor(private iconService: IconService) {}

    /*
     * ngOnInit()   ngOnInit is called right after the directive's data-bound properties have been checked for the first time, and before any of its children have been checked. ngoninit is instiated to call the geticons() function.
     */
    ngOnInit() {
        this.getIcons();
    }
    /*
     * getIcons()   getIcons() is used to get the results stored in the mock-icons
     * 
     * @return   Returns the result from mock-icons.ts
     */  
    getIcons(): void {
        this.iconService.getIcons("asdf")
            .subscribe(icons => this.icons = icons);
    }
    /*
     * getIconPath()   function to return the icon path in icons page
     * 
     * @param    The geticonpath() function pass the parameter as selected object from the result array
     * @return   Returns path of the icon in src attribute
     */
    getIconPath(icon: Icon): String {
        let path = "../assets/icons/" + icon.url;
        return path;
    }

    /*
     * clickImage()   Function calls on clicking the template section and returns the sub-category 
     * 
     * @param    The clickimage() function pass the parameter as selected object from the result array and the path is concatenated with the icon.url key value,
     */
    clickImage(icon: Icon): void {
        let path = setting.ICONURL + icon.url;
        this.iconService.getImage(path)
        .subscribe(
            (image: Blob) => {
                var reader = new FileReader();
                reader.readAsDataURL(image);
            }
        );
    }
}