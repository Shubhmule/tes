import { CartService } from '@/shared/services/cart.service';
import { ProductService } from '@/shared/services/product.service';
import { UtilsService } from '@/shared/services/utils.service';
import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-modal',
  // imports:[CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent {
  @Input() product!: any;
  @Input() isShowBottom: boolean = true;
  @Input() productD: any = {};
  baseSizeMrp: any = [];
  stockId!: string;
  textMore = true;
  mrp!: number;
  baseSizeMrpId!: number;
  selectedSize: any="S";
  sellingPrice: any;

  handleTextToggle() {
    this.textMore = !this.textMore;
  }

  constructor(
    public productService: ProductService,
    public utilsService: UtilsService,
    public cartService: CartService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.stockId = params['key'];
      if (this.stockId) {
        this.productService
          .getAllBaseSize(this.stockId)
          .subscribe((res: any) => {
            this.baseSizeMrp = res;
          });
      }
    });
  }

  handleIsColorVariant(product: any) {
    // if (product.imageURLs.some((item) => item?.color && item?.color?.name)) {
    //   return true;
    // } else {
    //   return false;
    // }
    if (product.colour) {
      return true;
    } else {
      return false;
    }
  }

  onProductSelected(item: any) {
    // console.log(item)
    this.mrp = item.mrp;
    this.baseSizeMrpId = item.baseSizeMrpId;
    this.sellingPrice = item.sellingPrice;
    // this.baseSizeMrpId=item.baseSizeMrpId;
    this.selectedSize = item.size;
  }

  ngOnInit() {}
}
