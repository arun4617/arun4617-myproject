// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license in root of repo.

/*
  This file defines a settings view. It is based on
  the settings sample, created by the Modern Assistance Experience Developer 
  Docs team. Along with other samples, it is in the Office-Add-in-UX-Design-Patterns-Code 
  repo:  https://github.com/OfficeDev/Office-Add-in-UX-Design-Patterns-Code
*/

import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    templateUrl: 'app/settings/settings.component.html',
    styleUrls: ['app/settings/settings.component.css']
})
export class SettingsComponent {
   
   // Get references to the radio buttons so we can toggle which is selected.
   @ViewChild('always') alwaysRadioButton: ElementRef;
   @ViewChild('onlyFirstTime') onlyFirstTimeRadioButton: ElementRef;

  constructor() {}

  
}

