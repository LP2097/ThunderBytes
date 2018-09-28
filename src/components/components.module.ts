import { NgModule } from '@angular/core';
import { GoogleLoginComponent } from './google-login/google-login';

import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [GoogleLoginComponent],
	imports: [
    CommonModule,
    IonicModule
  ],
	exports: [GoogleLoginComponent]
})
export class ComponentsModule {}
