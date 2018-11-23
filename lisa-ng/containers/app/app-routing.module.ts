import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchHomeComponent } from './search-home/search-home.component';
import { IconsHomeComponent } from './icons-home/icons-home.component';
import { UploadHomeComponent } from './upload-home/upload-home.component';
import { MetricsComponent } from './metrics/metrics.component';

const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchHomeComponent},
  { path: 'icons', component: IconsHomeComponent},
  { path: 'upload', component: UploadHomeComponent},
  { path: 'metrics', component: MetricsComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ], //, {useHash: true}
  exports: [ RouterModule ]
})

export class AppRoutingModule {}