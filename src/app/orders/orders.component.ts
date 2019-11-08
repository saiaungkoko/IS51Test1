import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlexModalService } from '../shared-components/flex-modal/flex-modal.service';
import { Http } from '@angular/http';
import { isNgTemplate } from '@angular/compiler';
import { IncomingMessage } from 'http';
interface Iorder {
  pid: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  orders: Array<Iorder> = [];
  name = '';
  errorMessage = '';
  confirmMessage = '';

  constructor(
    private router: Router,
    private flexModal: FlexModalService,
    private http: Http
  ) {
  }
  clear() {
    this.orders = [];
  }

  calculate() {
    const total = this.orders.reduce((inc, item, i, arc) => {
      inc += item.price * item.quantity;
      return inc;
    }, 0);
    const taxAmount = total * .1;
    const subTotal = total - taxAmount;
    return {
      total: total,
      taxAmount: taxAmount,
      subTotal: subTotal
    };
  }

  submit() {
    const commaIndex = this.name.indexOf(', ');
    let error = false;

    if (this.name === '') {
      this.errorMessage = 'Name must not be empty';
      error = true;
    } else if (commaIndex === -1) {
      this.errorMessage = 'Name must have a comma and a space!';
      error = true;
    }
    if (!error) {
      const firstName = this.name.slice(commaIndex + 1, this.name.length);
      const lastName = this.name.slice(0, commaIndex);
      const fullName = firstName + ' ' + lastName;
      const calculation = this.calculate();
      // tslint:disable-next-line: max-line-length
      this.confirmMessage = `Thank you for your order, ${fullName}. Your subtotal is: ${calculation.subTotal}, your tax amount is: ${calculation.taxAmount} and your grand total is: ${calculation.total}.`;
      this.flexModal.openDialog('confirm-modal');
    } else {
      this.flexModal.openDialog('error-modal');
    }
  }

  addItem(item: string) {
    switch (item) {
      case 'Android':
        this.orders.unshift({
          'pid': '1',
          'image': 'assets/sm_android.jpeg',
          'description': 'Android',
          'price': 150.00,
          'quantity': null
        });
        break;
      case 'IPhone':
        this.orders.unshift({
          'pid': '2',
          'image': 'assets/sm_iphone.jpeg',
          'description': 'IPhone',
          'price': 200.00,
          'quantity': null
        });
        break;
      case 'Windows Phone':
        this.orders.unshift({
          'pid': '3',
          'image': 'assets/sm_windows.jpeg',
          'description': 'Windows Phone',
          'price': 110.00,
          'quantity': null
        });

        break;
    }
  }

  delete(index: number) {
    this.orders.splice(index, 1);
  }

  async ngOnInit() {
    const rows = await this.http.get('assets/orders.json').toPromise();
    this.orders = rows.json();
    return rows.json();
  }
}
