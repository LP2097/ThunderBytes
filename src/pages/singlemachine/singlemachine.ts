import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as $ from 'jquery'
import * as moment from 'moment';
import {influxData} from "../../app/models/InfluxData";

@IonicPage()
@Component({
  selector: 'page-singlemachine',
  templateUrl: 'singlemachine.html',
})
export class SinglemachinePage {

  ip="192.168.1.121";

  listSensors:Array<string> = [];
  firstSensor: string;
  list: string;

  //variabili grafico a linee
  lineChartData:Array<any> = [{data: []}];
  lineChartLabels:Array<any> = [];
  lineChartLegend:boolean = false;
  lineChartType:string = 'line';
  lineChartOptions:any = {
    responsive: true
  };
  lineChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: '#EAE2B7',
      pointBackgroundColor: '#D62640',
      pointBorderColor: '#D62640',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  titleGraphs: string;
  Subtitle;
  percentMeasure: string;
  nameMachine: string;
  name;
  timeSelect: string;

  //variabili dei sensori posizionati
  amperometro: any;
  umidita: any;
  ventilatore: any;
  temperature: any;
  timeData: any;
  rpm: any;
  maxVal: string;

  //primo API mostra la media e la seleziono con questa variabile
  val: string = "somma";

  //salvo la data selezionata cosi se cambio da somma a media resta salvata
  time: string;

  //varibile contente la scelta del sensore dell'utente
  sensorsSelect: string;

  //stringa sul nome della macchina per la richiesta api
  apiMachine: string;


  options = {
    min: 0,
    title: 'Umidità'
  };
  max = 100;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public http: HttpClient) {
    this.nameMachine = navParams.get('machine');
  }

  onChange(list){

    if(list == "umidita"){
      this.titleGraphs = "\uf043";
      this.sensorsSelect = "umidita";
    }else if(list == "temperatura"){
      this.titleGraphs = "C°";
      this.sensorsSelect = "temperatura";
    }else if(list == "ventilatore"){
      this.titleGraphs = "\u09e9";
      this.sensorsSelect = "ventilatore";
    }else if(list == "rpm"){
      this.titleGraphs = "\uf0e4";
      this.sensorsSelect = "rpm";
    }else if(list == "amperometro"){
      this.titleGraphs = "\u2b33";
      this.sensorsSelect = "amperometro";
    }

    if(this.val == "somma"){
      this.sumData();
    }
    else if(this.val == "media")
      this.mediaData();
  }


  //refresh dei dati controlla se era su somma o media ed esegue il refresh
  doRefresh(refresher){
    if(this.val == "somma")
      this.sumData();
    else if(this.val == "media")
      this.mediaData();

    if (refresher != 0)
      refresher.complete();
  }

  //all'avvio della pagina nasconde il grafico con relativi bottoni e scritte
  ionViewDidLoad(){

    this.val = "somma";

    if(this.nameMachine == "FornoRiscaldamento"){
        this.nameMachine = "Forno riscaldamento";
        this.list = "umidita";
        this.firstSensor = "umidita";
        this.sensorsSelect = "umidita";
        this.titleGraphs = "\uf043";
    }else if(this.nameMachine == "FornoRaffredamento"){
      this.nameMachine = "Forno raffredamento";
      this.list = "umidita";
      this.firstSensor = "umidita";
      this.sensorsSelect = "umidita";
      this.titleGraphs = "\uf043";
    }else if(this.nameMachine == "FornoCottura"){
      this.nameMachine = "Forno cottura";
      this.list = "umidita";
      this.firstSensor = "umidita";
      this.sensorsSelect = "umidita";
      this.titleGraphs = "\uf043";
    }else if(this.nameMachine == "vPrimaMano"){
      this.nameMachine = "Verniciatura Prima Mano";
      this.list = "umidita";
      this.firstSensor = "umidita";
      this.sensorsSelect = "umidita";
      this.titleGraphs = "\uf043";
    }else if(this.nameMachine == "vSecondaMano"){
      this.nameMachine = "Verniciatura Secconda Mano";
      this.list = "umidita";
      this.firstSensor = "umidita";
      this.sensorsSelect = "umidita";
      this.titleGraphs = "\uf043";
    }else if(this.nameMachine == "motoreUno"){
      this.nameMachine = "Motore uno";
      this.list = "rpm";
      this.firstSensor = "rpm";
      this.sensorsSelect = "rpm";
      this.titleGraphs = "\uf0e4";
    }else if(this.nameMachine == "motoreDue") {
      this.nameMachine = "Motore due";
      this.list = "rpm";
      this.firstSensor = "rpm";
      this.sensorsSelect = "rpm";
      this.titleGraphs = "\uf0e4";
    }

    //di default seleziono i minuti e mostro i grafici
    this.time = "minuti";

    if(this.val == "somma")
      this.sumData();
    else if(this.val == "media")
      this.mediaData();

  }

  //al click salva il periodo selezionato e richiama la funziona della somma quella predefinita
  segmentChangedTime(selectTime){
    this.time = selectTime.value;
    this.sumData();
  }

  //svuoto gli array del grafico
  initialvarGraphs(){
    this.lineChartData = [{data: []}];
    this.lineChartLabels.length = null;
    this.listSensors.length = null;
    delete this.umidita;
    delete this.temperature;
    delete this.ventilatore;
    delete this.rpm;
    delete this.amperometro;
  }


  //funzione al click del segmento somma o media situato in basso
  segmentChangedVal(selectVal){
    if(selectVal.value == "somma"){
      this.val = "somma";
      this.sumData();
    }
    else if(selectVal.value == "media"){
      this.mediaData();
      this.val = "media";
    }
  }

  //funzione che gestisde le api riguardanti la somma
  sumData(){
    $(".circleProcess, .controlVal, #consumationFR, .graphs").show();              // mostro il grafico e scritte nascoste prima

    if(this.time == "ora") {
      this.timeSelect = "nell'ultima ora";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "sumFornoRiscaldamentoUltimaOra";
          break;

        case "Forno raffredamento":
          this.apiMachine = "sumFornoRaffredamentoUltimaOra";
          break;

        case "Forno cottura":
          this.apiMachine = "sumFornoCotturaUltimaOra";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "sumvPrimaManoUltimaOra";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "sumvSeccondaManoUltimaOra";
          break;

        case "Motore uno":
          this.apiMachine = "sumMotoreUnoUltimaOra";
          break;

        case "Motore due":
          this.apiMachine = "sumMotoreDueUltimaOra";
          break;

      }
    }else if(this.time == "minuti"){
      this.timeSelect = "nell'ultimi dieci minuti";
      console.log("Nome della macchina: " + this.nameMachine)

      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "sumFornoRiscaldamentoUltimiMinuti";
          break;

        case "Forno raffredamento":
          this.apiMachine = "sumFornoRaffredamentoUltimiMinuti";
          break;

        case "Forno cottura":
          this.apiMachine = "sumFornoCotturaUltimiMinuti";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "sumvPrimaManoUltimiMinuti";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "sumvSeccondaManoUltimiMinuti";
          break;

        case "Motore uno":
          this.apiMachine = "sumMotoreUnoUltimiMinuti";
          break;

        case "Motore due":
          this.apiMachine = "sumMotoreDueUltimiMinuti";
          break;

      }
    }else if(this.time == "giorno"){
      this.timeSelect = "nell'ultimo giorno";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "sumFornoRiscaldamentoUltimoGiorno";
          break;

        case "Forno raffredamento":
          this.apiMachine = "sumFornoRaffredamentoUltimoGiorno";
          break;

        case "Forno cottura":
          this.apiMachine = "sumFornoCotturaUltimoGiorno";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "sumvPrimaManoUltimoGiorno";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "sumvSeccondaManoUltimoGiorno";
          break;

        case "Motore uno":
          this.apiMachine = "sumMotoreUnoUltimoGiorno";
          break;

        case "Motore due":
          this.apiMachine = "sumMotoreDueUltimoGiorno";
          break;

      }
    }
    this.getMachine(this.nameMachine);
  }

  mediaData(){
    if(this.time == "ora") {
      this.timeSelect = "nell'ultima ora";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "meanFornoRiscaldamentoUltimaOra";
          break;

        case "Forno raffredamento":
          this.apiMachine = "meanFornoRaffredamentoUltimaOra";
          break;

        case "Forno cottura":
          this.apiMachine = "meanFornoCotturaUltimaOra";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "meanvPrimaManoUltimaOra";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "meanvSeccondaManoUltimaOra";
          break;

        case "Motore uno":
          this.apiMachine = "meanMotoreUnoUltimaOra";
          break;

        case "Motore due":
          this.apiMachine = "meanMotoreDueUltimaOra";
          break;

      }
    }else if(this.time == "minuti"){
      this.timeSelect = "nell'ultimi dieci minuti";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "meanFornoRiscaldamentoUltimiMinuti";
          break;

        case "Forno raffredamento":
          this.apiMachine = "meanFornoRaffredamentoUltimiMinuti";
          break;

        case "Forno cottura":
          this.apiMachine = "meanFornoCotturaUltimiMinuti";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "meanvPrimaManoUltimiMinuti";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "meanvSeccondaManoUltimiMinuti";
          break;

        case "Motore uno":
          this.apiMachine = "meanMotoreUnoUltimiMinuti";
          break;

        case "Motore due":
          this.apiMachine = "meanMotoreDueUltimiMinuti";
          break;

      }
    }else if(this.time == "giorno"){
      this.timeSelect = "nell'ultimo giorno";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "meanFornoRiscaldamentoUltimoGiorno";
          break;

        case "Forno raffredamento":
          this.apiMachine = "meanFornoRaffredamentoUltimoGiorno";
          break;

        case "Forno cottura":
          this.apiMachine = "meanFornoCotturaUltimoGiorno";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "meanvPrimaManoUltimoGiorno";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "meanvSeccondaManoUltimoGiorno";
          break;

        case "Motore uno":
          this.apiMachine = "meanMotoreUnoUltimoGiorno";
          break;

        case "Motore due":
          this.apiMachine = "meanMotoreDueUltimoGiorno";
          break;

      }
    }
    this.getMachine(this.nameMachine);
  }


  createCircle(){
    this.Subtitle = (percent: number) : string => {return percent + " %"};
  }

  getMachine(machine){
     this.http.get<influxData[]>("http://"+this.ip+":5000/" + this.apiMachine) //equivalente del metodo get di ajax
       .timeout(3000)
       .subscribe(data =>{
          if(machine == "Forno riscaldamento"){
            this.initialvarGraphs();

            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;

            this.calcPercent();

            this.listSensors.push("temperatura", "amperometro", "ventilatore");

            for(let i=0; i<data.length; i++){
              switch(this.sensorsSelect){
                case "umidita":
                  this.lineChartData[0].data.push(data[i].umidita);
                case "temperatura":
                  this.lineChartData[0].data.push(data[i].temperatura);
                case "amperometro":
                  this.lineChartData[0].data.push(data[i].amperometro);
                case "ventilatore":
                  this.lineChartData[0].data.push(data[i].ventilatore);
              }

              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Forno raffredamento"){
            this.initialvarGraphs();

            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;

            this.calcPercent();

            this.listSensors.push("temperatura", "amperometro", "ventilatore");

            for(let i=0; i<data.length; i++){
              switch(this.sensorsSelect){
                case "umidita":
                  this.lineChartData[0].data.push(data[i].umidita);
                case "temperatura":
                  this.lineChartData[0].data.push(data[i].temperatura);
                case "amperometro":
                  this.lineChartData[0].data.push(data[i].amperometro);
                case "ventilatore":
                  this.lineChartData[0].data.push(data[i].ventilatore);
              }

              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Forno cottura"){
            this.initialvarGraphs();

            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;

            this.calcPercent();

            this.listSensors.push("temperatura", "amperometro", "ventilatore");

            for(let i=0; i<data.length; i++){
              switch(this.sensorsSelect){
                case "umidita":
                  this.lineChartData[0].data.push(data[i].umidita);
                case "temperatura":
                  this.lineChartData[0].data.push(data[i].temperatura);
                case "amperometro":
                  this.lineChartData[0].data.push(data[i].amperometro);
                case "ventilatore":
                  this.lineChartData[0].data.push(data[i].ventilatore);
              }
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Verniciatura Prima Mano"){
            this.initialvarGraphs();

            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.umidita = data[0].umidita;

            this.calcPercent();

            this.listSensors.push("temperatura");

            for(let i=0; i<data.length; i++){
              switch(this.sensorsSelect){
                case "umidita":
                  this.lineChartData[0].data.push(data[i].umidita);
                case "temperatura":
                  this.lineChartData[0].data.push(data[i].temperatura);
              }

              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Verniciatura Secconda Mano"){
            this.initialvarGraphs();

            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.umidita = data[0].umidita;

            this.calcPercent();

            this.listSensors.push("temperatura");

            for(let i=0; i<data.length; i++){
              switch(this.sensorsSelect){
                case "umidita":
                  this.lineChartData[0].data.push(data[i].umidita);
                case "temperatura":
                  this.lineChartData[0].data.push(data[i].temperatura);
              }

              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Motore uno"){
            this.initialvarGraphs();

            this.rpm = data[0].rpm;
            this.timeData = data[0].time;

            console.log(this.rpm)
            this.calcPercent();


            for(let i=0; i<data.length; i++){
              switch(this.sensorsSelect){
                case "rpm":
                  this.lineChartData[0].data.push(data[i].rpm);
              }
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Motore due"){
            this.initialvarGraphs();

            this.rpm = data[0].rpm;
            this.timeData = data[0].time;

            this.calcPercent();

            for(let i=0; i<data.length; i++){
              switch(this.sensorsSelect){
                case "rpm":
                  this.lineChartData[0].data.push(data[i].rpm);
              }
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }

          }
           console.log("avvio funzioni");
           this.updatePercentMeasure();
           this.createCircle();
         },
         error =>{
           alert("errore in fase di chiamata");
         })
   }

   calcPercent(){
    this.maxValSelect();
    // salvare nella variabile maxVAl il valore massimo che viene utilizzato per il calcolo
    switch(this.time){
     case "minuti":
         this.umidita = (this.umidita/12000)*100;
         this.temperature = (this.temperature/12000)*100;
         this.ventilatore = (this.ventilatore/1200000)*100;
         this.rpm = (this.rpm/1200000)*100;
         this.amperometro = (this.amperometro/19200)*100;
         break;
     case "ora":
        this.umidita = (this.umidita/72000)*100;
        this.temperature = (this.temperature/72000)*100;
        this.ventilatore = (this.ventilatore/72000000)*100;
        this.rpm = (this.rpm/72000000)*100;
        this.amperometro = (this.amperometro/115200)*100;
        break;
     case "giorno":
       this.umidita = (this.umidita/1728000)*100;
       this.temperature = (this.temperature/1728000)*100;
       this.ventilatore = (this.ventilatore/1728000000)*100;
       this.rpm = (this.rpm/1728000000)*100;
       this.amperometro = (this.amperometro/2764800)*100;
       break;
     }
   }

   //funzione per salvare nella variabile il valore massimo del sensore
   maxValSelect(){
    switch (this.time) {
      case "minuti":
        if(this.sensorsSelect == "umidita"){
          this.maxVal = "12.000 Kg";
        }else if(this.sensorsSelect == "temperatura"){
          this.maxVal = "12.000 °C";
        }else if(this.sensorsSelect == "ventilatore"){
          this.maxVal = "1.200.000 rpm";
        }else if(this.sensorsSelect == "rpm"){
          this.maxVal = "1.200.000 rpm";
        }else if(this.sensorsSelect == "amperometro"){
          this.maxVal = "19.200 A";
        }
        break;
      case "ora":
        if(this.sensorsSelect == "umidita"){
          this.maxVal = "72.000 Kg";
        }else if(this.sensorsSelect == "temperatura"){
          this.maxVal = "72.000 °C";
        }else if(this.sensorsSelect == "ventilatore"){
          this.maxVal = "72.000.000 rpm";
        }else if(this.sensorsSelect == "rpm"){
          this.maxVal = "72.000.000 rpm";
        }else if(this.sensorsSelect == "amperometro"){
          this.maxVal = "115.200 A";
        }
        break;
      case "giorno":
        if(this.sensorsSelect == "umidita"){
          this.maxVal = "1.728.000 Kg";
        }else if(this.sensorsSelect == "temperatura"){
          this.maxVal = "1.728.000 °C";
        }else if(this.sensorsSelect == "ventilatore"){
          this.maxVal = "1.728.000.000 rpm";
        }else if(this.sensorsSelect == "rpm"){
          this.maxVal = "1.728.000.000 rpm";
        }else if(this.sensorsSelect == "amperometro"){
          this.maxVal = "2.764.800 A";
        }
        break;
    }

   }

  updatePercentMeasure(){
    //variabile che cambia in base al passaggio da un sensore all'altro

    console.log("updatePercent");
    if(this.sensorsSelect == "rpm")
      this.percentMeasure = this.rpm.toFixed(2);
    else if(this.sensorsSelect == "umidita")
      this.percentMeasure = this.umidita.toFixed(2);
    else if(this.sensorsSelect == "temperatura")
      this.percentMeasure = this.temperature.toFixed(2);
    else if(this.sensorsSelect == "ventilatore")
      this.percentMeasure = this.ventilatore.toFixed(2);
    else if(this.sensorsSelect == "amperometro")
      this.percentMeasure = this.amperometro.toFixed(2);
  }


  //funzioni al click sul grafico
  chartClicked(e:any):void {
    console.log(e);
  }

  chartHovered(e:any):void {
    console.log(e);
  }
}
