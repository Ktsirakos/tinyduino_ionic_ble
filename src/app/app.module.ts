import { EmailButtonComponent } from './email-button/email-button.component';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { HttpModule } from '@angular/http';
import { BLE } from '@ionic-native/ble/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModaloptionsComponent } from './modaloptions/modaloptions.component';


@NgModule({
  declarations: [
    AppComponent,
    ModaloptionsComponent,
    EmailButtonComponent
  ],
  entryComponents: [
    ModaloptionsComponent,
    EmailButtonComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule , HttpModule],
  providers: [
    File,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BLE,
    AndroidPermissions,
    SocialSharing
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
