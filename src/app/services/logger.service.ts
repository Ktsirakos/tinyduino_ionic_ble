import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  prefix: any;

  constructor() {
   }

   setLogPrefix(string : any){
     console.log(this)
    this.prefix = string;
   }

  log (...args : any[]){

    console.log(this);
    var msgs = [];
    
    msgs.push(this.prefix + ":");
    while(arguments.length){
      msgs.push([].shift.call(arguments));
    }

    console.log.apply(console, msgs);
  } 
  

  warn (...args : any[]){
    var msgs = [];
    
    msgs.push(this.prefix + ":");
    while(arguments.length){
      msgs.push([].shift.call(arguments));
    }

    console.warn.apply(console, msgs);
  }

  error (...args : any[]){
    var msgs = [];
    
    msgs.push(this.prefix + ":");
    while(arguments.length){
      msgs.push([].shift.call(arguments));
    }

    console.error.apply(console, msgs);
  }
}
