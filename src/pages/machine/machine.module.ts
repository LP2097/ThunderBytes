import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachinePage } from './machine';

@NgModule({
  declarations: [
    MachinePage,
  ],
  imports: [
    IonicPageModule.forChild(MachinePage),
  ],
})
export class MachinePageModule {}
