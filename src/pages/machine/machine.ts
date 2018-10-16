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


  list: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.list=0;
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

  onChange(list){
    switch (list){
      case 0:
        this.list=0;
        break;
      case 1:
        this.list=1;
        break;
      case 2:
        this.list=2;
        break;
      case 3:
        this.list=3;
        break;

    }
  }

}
