import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {SplashScreen} from "@ionic-native/splash-screen";

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  showSplash = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, public splashScreen: SplashScreen, public viewCtrl: ViewController) {}

  // funzione si avvia automaticamente mostra prima l'immagine e a seguire lo splashscrenn dell'azienda [BRAFORD]
  ionViewDidEnter()
  {
    this.splashScreen.hide();

    setTimeout(() => {
      this.showSplash = false;
      this.viewCtrl.dismiss();
    }, 4000);

  }
}
