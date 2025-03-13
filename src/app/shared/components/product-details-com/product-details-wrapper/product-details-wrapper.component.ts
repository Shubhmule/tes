import { Component, Input } from '@angular/core';
import { IProduct } from '@/types/product-type';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartService } from '@/shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@/shared/services/utils.service';

@Component({
  selector: 'app-product-details-wrapper',
  templateUrl: './product-details-wrapper.component.html',
  styleUrls: ['./product-details-wrapper.component.scss'],
})
export class ProductDetailsWrapperComponent {
  @Input() product!: any;
  @Input() isShowBottom: boolean = true;
  @Input() productD:any={}
  baseSizeMrp:any= [];
  stockId!: string;
  textMore = true;
  mrp!:number;
  baseSizeMrpId!:number;
  sellingPrice!:number;
  Math: any;
  userId: any;
  useName: any;
  authentication: boolean = true;
  size: any;
 selectedSize: string = "S";



  handleTextToggle() {
    this.textMore = !this.textMore;
  }

  constructor(
    public productService: ProductService,
    public util:UtilsService,
    public cartService: CartService,private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if (sessionStorage.getItem('currentUser') != "") {
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.userId = currentUser && currentUser.id;
      this.useName = currentUser.firstName + ' ' + currentUser.lastName;
      // console.log("userId " + this.userId);
      if(this.userId == undefined){
        this.authentication = true;
      }else{
        this.authentication = false;
      } 
    }
    ///
    this.activatedRoute.queryParams.subscribe(params => {
      this.stockId = params['stockId'];
        });

  if(this.stockId){
    this.productService.getAllBaseSize(this.stockId).subscribe((res: any) => {
      this.baseSizeMrp = res;
      for(let i=0;i<this.baseSizeMrp.length; i++){
        this.size=this.baseSizeMrp[i].size;
        this.mrp=this.baseSizeMrp[0].mrp;
        this.baseSizeMrpId=this.baseSizeMrp[0].baseSizeMrpId;
        this.sellingPrice=this.baseSizeMrp[0].sellingPrice;
        this.baseSizeMrpId=this.baseSizeMrp[0].baseSizeMrpId;
      }
      return(this.size);  
    });
  } 

  
  }

  onProductSelected(item:any) {
    // console.log(item)
        this.mrp=item.mrp;
        this.baseSizeMrpId=item.baseSizeMrpId;
        this.sellingPrice=item.sellingPrice;
        // this.baseSizeMrpId=item.baseSizeMrpId;
        this.selectedSize = item.size;        
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

  redirecttoWishlistPage(){
    if(this.userId == undefined){
      this.router.navigate(['/pages/login']);
    }
  }


  buynow(productD:any,sellingPrice:any){      
    sessionStorage.setItem('product', JSON.stringify(productD));
    sessionStorage.setItem('sellingPrice', JSON.stringify(sellingPrice));
    this.router.navigate(['/pages/checkout'])
  }
  ngOnInit() {}
}
