import { LoggerService } from './logger.service';
import { DataReplayService } from './data-replay.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  currentEntry: number[] = [];
  previousEntry: number[] = [];
  lastVelocityX: number = 0;
  lastVelocityY: number = 0;
  lastVelocityZ: number = 0;
  velocity : any = {
    "x" : [],
    "y" : [],
    "z" : [],
    "time" : []
  }


  acceleration : any = {
    "x" : [],
    "y" : [],
    "z" : [],
    "time": []
  }


  position : any = {
    "x" : [],
    "y" : [],
    "z" : [],
    "time": []
  }

  constructor(
    private dataReplayService : DataReplayService,
    private logger : LoggerService
  ) {

    this.logger.setLogPrefix("[Calculation Service]");
    this.logger.log("Dummy" , "Output!");


    var readingInterval = setInterval(async () => {
      this.previousEntry = this.currentEntry;
      this.currentEntry = this.dataReplayService.getNextEntry();
      this.dataReplayService.increaseCounter();
      
      if(this.currentEntry == undefined) {
        console.warn("Transmissio stoped");
        clearInterval(readingInterval);
        console.log(this.velocity)
        return;
      }
      if(this.previousEntry == undefined) return;

      this.acceleration.x.push(this.currentEntry[0])
      this.acceleration.y.push(this.currentEntry[1])
      this.acceleration.z.push(this.currentEntry[2])

      this.velocity.time.push(this.currentEntry[3])
      this.acceleration.time.push(this.currentEntry[3])
      this.position.time.push(this.currentEntry[3])


      //calculate acceleration.
      // var Current_acceleration = Math.sqrt(Math.pow(this.currentEntry[0],2) + 
      //                                      Math.pow(this.currentEntry[1],2) +
      //                                      Math.pow(this.currentEntry[2],2)
      // );
                                           


      // var Previous_acceleration = Math.sqrt(Math.pow(this.previousEntry[0],2) + 
      //                                       Math.pow(this.previousEntry[1],2) +
      //                                       Math.pow(this.previousEntry[2],2)
      // );

      

      this.lastVelocityX = this.fromAccelToVel(this.previousEntry[3] , this.currentEntry[3] ,
                                     this.previousEntry[0] , this.currentEntry[0],
                                     this.lastVelocityX
                                    )

      this.lastVelocityY = this.fromAccelToVel(this.previousEntry[3] , this.currentEntry[3] ,
                                      this.previousEntry[1] , this.currentEntry[1],
                                      this.lastVelocityY
      )


      this.lastVelocityZ = this.fromAccelToVel(this.previousEntry[3] , this.currentEntry[3] ,
                                              this.previousEntry[2] , this.currentEntry[2],
                                              this.lastVelocityZ
       )

      if(isNaN(this.lastVelocityX)) {
        this.lastVelocityX = 0;
      }


      if(isNaN(this.lastVelocityY)) {
        this.lastVelocityY = 0;
      }

      if(isNaN(this.lastVelocityZ)) {
        this.lastVelocityZ = 0;
      }

      this.velocity.x.push(this.lastVelocityX);
      this.velocity.y.push(this.lastVelocityY);
      this.velocity.z.push(this.lastVelocityZ);

    } , 5);

   }

   ngOnDestroy(){
     this.logger.warn("Destroying Service");
   }


   public getVelocities(){
    return this.velocity;
   }

   public getAccelerations(){
     return this.acceleration;
   }

   private fromVelToPos(previous_time , time , previous_vel , vel , lastPosition){
      var t_i =  <number> parseFloat(time);
      var t_i_1 =  <number> parseFloat(previous_time);
      var vel_i =  <number> parseFloat(vel);
      var vel_i_1 =  <number> parseFloat(previous_vel);
      var lastPos = <number> parseFloat( lastPosition);

      return (t_i - t_i_1)*((vel_i + vel_i_1) / 2) + lastPos;
   }


   private fromAccelToVel(previous_time , 
                          time   , 
                          previous_accel , 
                          accel , 
                          lastVelocity) : number{

    let t_i = <number> parseFloat(time);
    var t_i_1 = <number> parseFloat(previous_time);
    var accel_i = <number> parseFloat(accel);
    var accel_i_1 = <number>parseFloat(previous_accel);
    var lastVel = <number> parseFloat(lastVelocity)

    let a : number = (t_i - t_i_1);
    let b : number = (((accel_i) + accel_i_1) / 2)

    let c : number = a * b;
    let d : number = c + lastVel;

    return d
 }
}
