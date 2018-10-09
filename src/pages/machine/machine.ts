import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {SinglemachinePage} from "../singlemachine/singlemachine";

/**
 * Generated class for the MachinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-machine',
  templateUrl: 'machine.html',
})
export class MachinePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {

  }

  data;

  ionViewDidLoad() {
    console.log('ionViewDidLoad MachinePage');
  }

  getMachine(machine){
    console.log(machine);
    this.navCtrl.push(SinglemachinePage, {
      'machine':machine,
    })


  }





}
