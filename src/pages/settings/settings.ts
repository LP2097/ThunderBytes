import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Provider} from "../../providers/provider/provider";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private provider: Provider) {
    this.getUserInfo();
  }

  user;

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }


  getUserInfo(){
    this.user = this.provider.user;
    console.log(JSON.stringify(this.user));
  }

}
