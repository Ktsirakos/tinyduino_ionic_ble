import { Platform, ToastController, ModalController } from '@ionic/angular';
declare let require;
import { Component, OnInit, NgZone } from '@angular/core';
import { createAnimation } from "@ionic/core";
import { random } from 'random'
import * as $ from "jquery";
import { BluetoothService } from '../services/bluetooth.service';
import { BLE } from '@ionic-native/ble/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

var random = require('random');
@Component({
  selector: 'app-graphs-home',
  templateUrl: './graphs-home.page.html',
  styleUrls: ['./graphs-home.page.scss'],
})
export class GraphsHomePage implements OnInit {

  lastHeight : any = 0;
  intervalTime: number;
  negative : any = true;
  currentHeight: any;
  currentTop: any;
  once: any = {
    "X" : true,
    "Y" : true,
    "Z" : true,
  }
  peripheral: any;
  acceleration: any = {};
  dataInterval: any;
  constructor(
    private route: ActivatedRoute,
    public modalController : ModalController,
    private bleAPI : BluetoothService
  ) { 




  }

  ngOnInit() {
    // this.initAnimations();
    // this.playAnimations();


    this.peripheral =  JSON.parse(this.route.snapshot.paramMap.get("device"));



    this.acceleration = {
      "x" : 0 ,
      "y" : 0 ,
      "z" : 0
    };

    this.bleAPI.connectToDevice(this.peripheral).then(() => this.startTransmitting());
    // this.bleAPI.dummyTest();

    // this.ble.connect(this.peripheral.id).subscribe(
    //   peripheral => this.onConnected(peripheral),
    //   peripheral => this.onDeviceDisconnected(peripheral)
    // );

    // this.bleAPI.createCSV();

    
    // this.intervalTime = 1100
    // setInterval(() => {
    //   this.makeAnimation(random.float() * 2 -1, 'X');
    // } , this.intervalTime); 
    // setInterval(() => {
    //   this.makeAnimation(random.float() * 2 - 1 , 'Y');
    // } , this.intervalTime);
    // setInterval(() => {
    //   this.makeAnimation(random.float() * 2 - 1 , 'Z');
    // } , this.intervalTime);
  }


  startTransmitting(){
    this.dataInterval = setInterval(() => {
      var acceleration = this.bleAPI.getCurrentAcceleration();
      this.acceleration = acceleration;
      // console.log(this.acceleration);
    } , 500);


    this.resetAxis();

    this.intervalTime = 600
    setInterval(() => {
      this.makeAnimation(this.acceleration.x, 'X');
    } , this.intervalTime); 
    setInterval(() => {
      this.makeAnimation(this.acceleration.y , 'Y');
    } , this.intervalTime);
    setInterval(() => {
      this.makeAnimation(this.acceleration.z, 'Z');
    } , this.intervalTime);
  }
  


  resetAxis(){
    this.negativeToZero('X');
    this.negativeToZero('Y');
    this.negativeToZero('Z');
  }


  getPositiveAxisHeight(whichOne){
    return $(`#coverPositive${whichOne}`).height();
  }

  getNegativeAxisHeight(whichOne){
    return $(`#negative${whichOne}`).height();
  }

  getPositiveAxisTop(whichOne){
    return $(`#positive${whichOne}`).position().top;
  }


  positiveToZero(whichOne){
    this.currentHeight = this.getPositiveAxisHeight(whichOne);
    createAnimation()
    .duration(50)
    .addElement(document.getElementById(`coverPositive${whichOne}`))
    .fromTo('height' , `${this.currentHeight}px` , `200px`)
    .play()
  }

  negativeToZero(whichOne){
    this.currentHeight = this.getNegativeAxisHeight(whichOne);
    createAnimation()
    .duration(50)
    .addElement(document.getElementById(`negative${whichOne}`))
    .fromTo('height' , `${this.currentHeight}px` , `0px`)
    .play()
  }

  positiveTopReset(whichOne){
    createAnimation()
    .duration(50)
    .addElement(document.getElementById(`positive${whichOne}`))
    .fromTo('top' , `300px`  , `100px`)
    .play()
  }


  makeAnimation(height , whichOne){
    if(height > 1){
      height = 1;
    }else if(height < -1){
      height = -1;
    }
    this.negative = height < 0.0;
    if(this.negative){
      if(this.once[whichOne]){
        this.positiveToZero(whichOne);
        this.once[whichOne] = false
      }
        this.currentHeight = this.getNegativeAxisHeight(whichOne);
        createAnimation()
        .duration(this.intervalTime - 100)
        .addElement(document.getElementById(`negative${whichOne}`))
        .fromTo('height' , `${this.currentHeight}px` , `${(200*Math.abs(height))}px`)
        .play()
    }else{
      if(!this.once[whichOne]){
        this.negativeToZero(whichOne);
        // this.positiveTopReset();
        this.once[whichOne] = true;
      }
      this.currentHeight = this.getPositiveAxisHeight(whichOne);
      createAnimation()
      .duration(this.intervalTime - 100)
      .addElement(document.getElementById(`coverPositive${whichOne}`))
      // .fromTo('top' , `${this.getPositiveAxisTop()}px` , `${100 + 200*height}px`)
      .fromTo('height' , `${this.currentHeight}px` , `${200 - 200*height}px` )
      .play()
    }
    this.lastHeight = height;
  }

  ionViewWillLeave(){
    clearInterval(this.dataInterval);
  }
}
