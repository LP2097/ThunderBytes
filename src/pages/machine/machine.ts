import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {SinglemachinePage} from "../singlemachine/singlemachine";

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

  readChart(machine){
    console.log(machine);
    this.navCtrl.push(SinglemachinePage, {
      'machine':machine,
    })


  }

}
