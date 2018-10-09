import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SinglemachinePage } from './singlemachine';

@NgModule({
  declarations: [
    SinglemachinePage,
  ],
  imports: [
    IonicPageModule.forChild(SinglemachinePage),
  ],
})
export class SinglemachinePageModule {}
