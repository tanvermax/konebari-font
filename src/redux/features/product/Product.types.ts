// Card/listing view — matches the projection returned by GET /alldata
export interface IProductCard {
  _id: string;
  name: string;
  mainImage?: string;
  minPrice?: number;
  maxPrice?: number;
  specialPrice?: number;
  hasDiscount: boolean;
  inStock: boolean;
  category?: string;
  slug?: string;
}

export interface IProductVariant {
  skuId: string;
  combo?: string;
  price: number;
  specialPrice?: number;
  quantity: number;
  status: 'active' | 'inactive';
  image?: string;
  images?: string[];
}

// Full detail view — matches GET /alldata/:id
export interface IProductDetail extends IProductCard {
  nameBn?: string;
  images?: string[];
  description?: string;
  highlights?: string;
  warranty?: string;
  specs?: Record<string, string>;
  variants: IProductVariant[];
  totalStock: number;
}