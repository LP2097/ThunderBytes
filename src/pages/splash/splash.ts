import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {SplashScreen} from "@ionic-native/splash-screen";

/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  showSplash = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, public splashScreen: SplashScreen, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  ionViewDidEnter() {

    this.splashScreen.hide();

    setTimeout(() => {
      this.showSplash = false;
      this.viewCtrl.dismiss();
    }, 4000);

  }
}
