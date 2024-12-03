import { Injectable } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from "@capacitor/push-notifications";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "./storage/storage.service";;

const FCM_TOKEN = 'push_notification_token';
@Injectable({
  providedIn: 'root'
})

export class MessagingService {

  private _redirecy = new BehaviorSubject<any>(null);

  get redirect(){
    return this._redirecy.asObservable();
  }

  constructor(
    private storage: StorageService
  ) { }


  initPush(){
    if(Capacitor.getPlatform() !== 'web'){
      this.registerPush();
      // this.getDeliveredNotifications();
    }
  }

  private async registerPush(){
    try {
      await this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt'){
        permStatus = await PushNotifications.requestPermissions();
      }

      if(permStatus.receive !== 'granted'){
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch (e) {
      console.log(e);
    }
  }

  async getDeliveredNotifications(){
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  addListeners(){
    PushNotifications.addListener(
      'registration',
      async(token: Token) => {
        console.log('My token: ', token);
        const fcm_token = (token?.value);
        let go = 1;
        const save_token = JSON.parse((await this.storage.getStorage(FCM_TOKEN)).value);
        if(save_token){
          if(fcm_token == save_token){
            console.log('same token');
            go = 0;
          }else{
            go = 2;
          }
        }
        if(go == 1) {
          //Save token
          this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcm_token));
        } else if( go == 2){
          // Update token
          const data = {
            expired_token: save_token,
            refreshed_token: fcm_token
          };
          this.storage.setStorage(FCM_TOKEN, fcm_token);
        }
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push receivod: ' + JSON.stringify(notification));
        const data = notification?.data;
        if(data?.redirect) this._redirecy.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('push data: ', data);
        if(data?.redirect) this._redirecy.next(data?.redirect);
      }
    );
  }

  async removeFcmToken(){
    try{
      const save_token = JSON.parse((await this.storage.getStorage(FCM_TOKEN)).value);
      this.storage.removedStorage(save_token);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }
}
