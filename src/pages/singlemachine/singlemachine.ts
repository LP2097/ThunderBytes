import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import { VerniciaturaPrimaMano} from "../../app/models/CharData";

/**
 * Generated class for the SinglemachinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-singlemachine',
  templateUrl: 'singlemachine.html',
})
export class SinglemachinePage {

  public lineChartData;
  temperature=[];
  time=[];
  machine;
  options = {
    min: 0,
    title: 'Umidità'
  };
  max = 100;
  value;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public http: HttpClient) {
    this.machine = navParams.get('machine');
    this.getMachine(this.machine);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SinglemachinePage');
  }



  getMachine(machine){
    this.http.get<VerniciaturaPrimaMano>("http://172.20.10.2:5000/"+machine+"") //equivalente del metodo get di ajax
      .timeout(3000)
      .subscribe(data =>{

          this.lineChartData = data;
          console.log(this.lineChartData);
        this.getTemperature(this.lineChartData)
          //ASSOCIAMO LAstinga feature alla array terremoti
        },
        error =>{
          alert("errore in fase di chiamata");
        })

  }



  getTemperature(chardata){
    console.log(chardata);
    for(let i =0; i<chardata.length; i++){
      this.temperature.push(chardata[i].temperatura);
      this.time.push(chardata[i].time);

    }

    this.value=this.lineChartData[0].umidita;
    console.log(this.temperature);
    console.log(this.time);
  };

  public lineChartLabels:Array<any>=this.time;


  public lineChartDatas:Array<any> = [
    {data: this.temperature, label: 'Series A'},

  ];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  doRefresh(){
    console.log("chiamata a get Machine");
    this.temperature=[];
    this.time=[];
    this.getMachine(this.machine);
  }

}
