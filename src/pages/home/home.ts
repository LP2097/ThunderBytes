import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { transition } from 'd3-transition';
import {HttpClient} from '@angular/common/http';

//import {PieChart} from '../../data/data'
//import {Chart} from '../../data/data'

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Interpolate from "d3-interpolate";
import * as d3Transition from 'd3-transition';
import * as $ from 'jquery'

// --------------------------- Start variabili grafico sensori ---------------------------
//var x = Chart;
var boolCreateGraphsS = false;
var width;
var height;
var radius;
// --------------------------- End variabili grafico sensori ---------------------------

var z = 0;                  // variabile per calcolare la corrente dell'intero impianto
var ip = "192.168.1.125";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  notification(){
    console.log("notifiche");
  }

  doRefresh(refresher){
    if (document.readyState === "complete") {                         // svolge il tutto solo quando l'intera pagina e stata caricata
      this.getDatakwHFactory();
      z = 0;

      $('.arcMachine').remove();


      this.http.get("http://" + ip + ":5000/correnteForno")
        .subscribe(data => {
            this.drawPie(data);                                        //chiamata alla funzione per disegnare il grafico delle macchine
          },
          error => {
            alert("il server non risponde... attendi e spera");
          });

      if (refresher != 0)
        refresher.complete();
    }
  }

  correnteImpianto: number = 0;

  margin = {top: 30, right: 20, bottom: 10, left: 20};
  width: number;
  height: number;
  radius: number;

  legendRectSize: number = 15;
  legendSpacing: number = 10;
  legendHeight: number = this.legendRectSize + this.legendSpacing;


  arc: any;
  pie: any;
  color: any;
  svg: any;
  data;

  constructor(public navCtrl: NavController, private http: HttpClient) {
    this.getDatakwHFactory();

    /*assegno grandezza e altezza del grafico delle macchine*/
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;

    /*utilizzo la stessa grandezza del grafico macchine per il grafico dei sensori*/
    width = this.width;
    height = this.height;
    radius = this.radius;
  }

  /*funzione che si avvia automaticamente dopo il costruttore e avvio
  * le funzioni per disegnare il grafico delle macchine*/
  async ionViewDidEnter() {
    this.initSvg();
    this.data = await this.getData();

  }


  // ----------------------------------------- Start chimata API -----------------------------------------
  async getData(){
    await this.http.get("http://" + ip + ":5000/correnteForno")
      .subscribe(data =>{
          this.drawPie(data);                                        //chiamata alla funzione per disegnare il grafico delle macchine
          this.drawLegend();                                         //chiamata alla funzione per disegnare la legenda delle macchine
        },
        error =>{
          alert("il server non risponde... attendi e spera");
        })
  }

  getDatakwHFactory(){
    this.http.get("http://" + ip + ":5000/correnteImpianto")
      .subscribe(data =>{
          for(var i=0; i<=2; i++) {
            if (data[i].sum) {
              var x = data[i].sum;
              z = z + x;
            } else {
              this.correnteImpianto += 0
            }
          }
          this.correnteImpianto = z;
        },
        error =>{
          alert("il server non risponde... attendi e spera");
        });
  }

  // ----------------------------------------- End chimata API ------------------------------------------*/

  // ---------------------------- Start inizializzo il grafico delle macchine ---------------------------
  initSvg() {
    this.color = d3Scale.scaleOrdinal()
      .range(["#FFA500", "#00FF00", "#FF0000", "#6b486b", "#FF00FF", "#d0743c", "#00FA9A"]);

    this.arc = d3Shape.arc()
      .outerRadius(this.radius - 60)
      .innerRadius(120)
      .padAngle(.03);

    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.corrente);

    this.svg = d3.select("#pieChart")
      .append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr("class", "svgMachine")
      .attr('viewBox','0 0 '+Math.min(this.width,this.height)+' '+ (Math.min(this.width,this.height) - 60) )
      .append("g")
      .attr("transform", "translate(" + Math.min(this.width,this.height) / 2 + "," + (this.radius - 10) + ")");
  }
  // --------------------------- End inizializzo il grafico delle macchine ---------------------------

  //--------------------------- Start disegno il grafico delle macchine ---------------------------
  /**
   * @param data --> dati ricevuti dalla chimata API
   */
  drawPie(data) {

    let bolt = this.svg.selectAll(".bolt")
      .data(data)
      .enter().append("g")
      .attr("class", "bolt")

    bolt.append('text')
      .attr("x", -45)
      .attr("y", 20)
      .attr('font-family', 'FontAwesome')
      .attr('font-size', "160px" )
      .text(function(d) { return '\uf0e7' });

    let g = this.svg.selectAll(".arc")
      .data(this.pie(data))
      .attr("class", "gMachine")
      .enter()
      .append("g");

    g.append("path").attr("d", this.arc)
      .style("fill", (d: any) => this.color(d.data.nomeMacchina))
      .attr("class", (d: any) => "arcMachine")
      .on("click", function (d) {

        $('div.headerSensors').show();

        if (boolCreateGraphsS == true) {
          $('svg.fuck').remove();
        }

        $('text#text').remove();

        var lenghtX;                          // definire la posizione sull'asse delle x del nome della macchina

        if(d.data.nomeMacchina.length < 12)
          lenghtX = -80;
        else{
          if(d.data.nomeMacchina == "fornoCottura")
            lenghtX = -80;
          else
            lenghtX = -100;
        }

        g.append("text")
          .attr("x", lenghtX)
          .attr("id", "text")
          .attr("y", -190)
          .attr("dy", ".35em")
          .text(d.data.nomeMacchina)
          .style("font-size", "25px")
          .style("font-family", "Cocogoose");

        g.append("text")
          .attr("x", -45)
          .attr("id", "text")
          .attr("y", 65)
          .attr("dy", ".35em")
          .text(d.data.corrente.toFixed(3) + " Kwh")
          .style("font-size", "25px")
          .style("font-family", "GeosansLight");


        switch (d.data.nomeMacchina) {
          case "fornoCottura":
            //x = PieChart;
            //prova();
            break;
          case "fornoRiscaldamento":
            //x = Chart;
            //prova();
            break;
        }
      });
  }

  // --------------------------- End disegno il grafico delle macchine ---------------------------

  dataL: number = 0;
  offset: number = 150;
  svgLegned4: any;
  newdataL: any;
  newdatah: any = 0;
  w:number = 500;
  h:number = 100;



  drawLegend(){
    this.svgLegned4 = d3.select(".legend4").append("svg")
      .attr("width", this.width)
      .attr("height", this.h - 50)
      .attr("class", "shadow");

    let legend4 = this.svgLegned4.selectAll('.legends4')
      .data(this.color.domain())
      .enter().append('g')
      .attr("class", "legends4")
      .attr("transform", (d:any, i:any) => {
        if (i === 0) {
          this.dataL = d.length + this.offset
          return "translate(0,0)"
        } else {
          if(this.newdataL > 100){
            this.dataL = 0;
            this.newdatah += 25;
          }
          this.newdataL = this.dataL
          this.dataL += d.length + this.offset
          return "translate(" + (this.newdataL) + ","+ this.newdatah +")"

        }
      })

    legend4.append('rect')
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", (i: any) => this.color(i))

    legend4.append('text')
      .attr("x", 20)
      .attr("y", 15)
      .text(function (d, i) {
        return d
      })
      .attr("class", "textselected")
      .style("text-anchor", "start")
      .style("font-size", 18)
      .style("font-family", "Roboto");
  }

}

var pie;
var color;
var arc;
var svg;
var path;
var translateHeight = (Math.min(width, height) / 2) - 80;
var translateWidth = Math.min(width, height) / 2;

function prova() {
  boolCreateGraphsS = true;

  pie = d3Shape.pie()
    .value((d: any) => d.sensori)
    .sort(null)
    .padAngle(.03);

  color = d3Scale.scaleOrdinal()
    .range(["#FFA500", "#00FF00", "#FF0000", "#6b486b", "#FF00FF", "#d0743c", "#00FA9A"]);

  arc = d3Shape.arc()
    .outerRadius(radius - 100)
    .innerRadius(80);

  svg = d3.select("#chart")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+Math.min(width, height)+' '+Math.min(width, height))
    .attr("class", "shadow")
    .attr("class", "fuck")
    .append('g')
    .attr("transform", "translate(" + Math.min(width, height) / 2 + "," + (radius - 100) + ")");

  path = svg.selectAll('path')
    .data(pie())
    .enter()
    .append('path')
    .attr("d", arc)
    .style("fill", (d: any) => color(d.data.x))
    .transition()
    .duration(1000)
    .attrTween("d", (d: any) => {
      var interpolate = d3Interpolate.interpolate({startAngle: 0, endAngle: 0}, d);
      return function (t) {
        return arc(interpolate(t));
      };
    });

  path = d3Transition.transition();


  var restOfTheData = function () {
    svg.selectAll("text")
      .data(pie())
      .enter()
      .append("text")
      .transition()
      .duration(200)
      .attr("transform", (d: any) => {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".4em")
      .attr("text-anchor", "middle")
      .text((d: any) => d.data.sensori)
      .style("fill", "#fff")
      .style("font-size", "20px");

    var legendRectSize = 15;
    var legendSpacing = 10;
    var legendHeight = legendRectSize + legendSpacing;

    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return 'translate(-35,' + ((i * legendHeight) - 50 + ')');
      });

    legend.append('rect')
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .style("fill", (d: any) => color(d))
      .style("stroke", "#fff");


    legend.append('text')
      .attr("x", 25)
      .attr("y", 15)
      .text(function (d) {
        return d;
      })
      .style("fill", "#237")
      .style("font-size", "18px")
      .style("font-family", "Cocogoose");
  }

  setTimeout(restOfTheData,1000);
}

