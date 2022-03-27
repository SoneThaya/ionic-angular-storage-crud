import { Component, ViewChild } from '@angular/core';
import { ListenerCallback } from '@capacitor/core';
import { StorageService, Item } from '../services/storage.service';
import { IonList, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: Item[] = [];

  newItem: Item = <Item>{};

  @ViewChild('mylist') mylist: IonList;

  constructor(
    private storageService: StorageService,
    private plt: Platform,
    private toastController: ToastController
  ) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  // create
  addItem() {
    this.newItem.modified = Date.now();
    this.newItem.id = Date.now();

    this.storageService.addItem(this.newItem).then((item) => {
      this.newItem = <Item>{};
      this.showToast('Item added!');
      this.loadItems(); // or add it to the array directly
    });
  }

  // read
  loadItems() {
    this.storageService.getItems().then((items) => {
      this.items = items;
    });
  }

  // update
  updateItem(item: Item) {
    item.title = `UPDATED: ${item.title}`;
    item.modified = Date.now();

    this.storageService.updateItem(item).then((item) => {
      this.showToast('Item updated!');
    });
  }

  // delete
  deleteItem(item: Item) {
    this.storageService.deleteItem(item.id).then((item) => {
      this.showToast('Item removed!');
      this.mylist.closeSlidingItems(); // fix or sliding is stuck afterwards
      this.loadItems(); // or splice it from the array directly
    });
  }

  // helper
  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
