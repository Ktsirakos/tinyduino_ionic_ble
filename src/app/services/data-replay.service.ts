import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import * as papa from "papaparse"
import DummyData from "./dummydata"
declare let window;
@Injectable({
  providedIn: 'root'
})

export class DataReplayService {

  fileURL = "assets/data.csv";

  data = DummyData.data;
  result: any = [];
  counter: number = 0;

  constructor(private http : Http) { 


    this.getDataFromCSV();
}

  private getDataFromCSV(){
    this.result = papa.parse(this.data);
    this.result.data.splice(0 , 1);
    this.result.data.splice(0 , 1);
    console.log(this.result);
  }


  resetCounter() {
    this.counter = 0;
  }

  getNextEntry(){
    if(this.counter == this.result.data.length){
      return undefined;
    }
    return this.result.data[this.counter];
  }

  getCounter(){
    return this.counter;
  }

  increaseCounter(){
    this.counter++;
  }

  decreaseCounter(){
    this.counter--;
  }

  getArray(){
    return this.result.data;
  }
}
