import { CartService } from '@/shared/services/cart.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  couponCode: number = 0;
  shipCost: number = 0;
  data: any = [];
  price: number = 0;
  // price:number=0
  isLoading = true;

  constructor(
    public cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.getCartProductstwo();
    // cartService.initializeCounter();
    sessionStorage.removeItem('product');
  }

  getCartProductstwo(): void {
    this.cartService.getCartProductstwo().subscribe((res) => {
      this.data = res;
      this.isLoading = false;
    });
  }

  getTotalPrice() {
    return this.data
      .reduce((total: number, item: any) => {
        if (item.mrp) {
          total += (item.mrp * item.quantityInKit) + ((item.mrp*item.quantityInKit)*(item.salesGst/100));
        }
        return total;
      }, 0)
      .toFixed(2); // You can adjust the decimal places as necessary
  }

  handleCouponSubmit() {
    console.log(this.couponCode);
    // Add coupon code handling logic here
    if (this.couponCode) {
      // logic here
      // when submitted the from than empty will be coupon code
      // this.couponCode = '';
    }
  }

  handleShippingCost(value: number | string) {
    if (value === 'free') {
      this.shipCost = 0;
    } else {
      this.shipCost = value as number;
    }
  }

  removeCartProduct(payload: any): void {
    this.cartService.removeCartProduct(payload).subscribe(
      (res) => {
        if (res) {
          console.log('res----------->', res);
        }
      },
      (error: string) => {
        this.getCartProductstwo();

        console.log(error);
      }
    );
  }

  incrementQuantity(product: any) {
    product.quantityInKit++;
    this.cartService
      .updateQuantity(product.id, product.quantityInKit, product.cartId)
      .subscribe();
    this.getTotalPrice();
  }

  clearcart(userId: number): void {
    this.cartService.clear_cart(userId).subscribe({
      next: () => this.getCartProductstwo(), // Only run after cart is cleared
      error: (err) => this.getCartProductstwo(),
    });
  }

  clearcheckout(userId: number): void {
    this.cartService.clear_checkout(userId).subscribe({
      next: () => this.getCartProductstwo(), // Only run after cart is cleared
      error: (err) => this.getCartProductstwo(),
    });
  }
  decrementQuantity(product: any) {
    if (product.quantityInKit > 1) {
      product.quantityInKit--;
      this.cartService
        .updateQuantity(product.id, product.quantityInKit, product.cartId)
        .subscribe();
      this.getTotalPrice();
    }
  }

  applicopupn(code: number) {
    let p = this.getTotalPrice();
    let price = (code * p) / 100;
    this.price = p - price;
  }

  redirecttoproduct(product: any) {
    this.router.navigate(['/shop/shop-details/'], {
      queryParams: {
        stockId: product.stockId,
        type: product.type,
      },
      relativeTo: this.activatedRoute,
    });
  }
}
