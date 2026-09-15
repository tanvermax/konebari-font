// Product.types.ts
export interface IProductVariant {
  skuId: string;
  combo?: string | null;
  price: number;
  specialPrice?: number;
  quantity: number;
  status: 'active' | 'inactive';
  image?: string | null;
  images?: string[];
  shopSku?: string;
  sellerSku?: string;
  specialPriceStart?: string;
  specialPriceEnd?: string;
  weightKg?: number;
  dims?: {
    l: number;
    w: number;
    h: number;
  };
  dangerousGoods?: string | null;
}

// Card/listing view — matches the projection returned by GET /alldata
export interface IProductCard {
  _id: string;
  name: string;
  nameBn?: string;
  mainImage?: string;
  minPrice?: number;
  maxPrice?: number;
  specialPrice?: number;
  hasDiscount: boolean;
  inStock: boolean;
  category?: string;
  slug?: string;
  totalStock?: number;
  variantCount?: number;
  status?: 'active' | 'inactive';
}

// Full detail view — matches GET /alldata/:id
export interface IProductDetail extends IProductCard {
  catId?: string;
  description?: string;
  highlights?: string;
  warranty?: string | null;
  warrantyType?: string | null;
  specs?: Record<string, string>;
  variants: IProductVariant[];
  images?: string[];
  whiteBackgroundImage?: string;
  totalStock: number;
  inStock: boolean;
  hasDiscount: boolean;
  variantCount: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

// Create Product Payload
export interface ICreateProductPayload {
  _id: string;
  catId: string;
  name: string;
  nameBn?: string;
  description?: string;
  highlights?: string;
  warranty?: string | null;
  warrantyType?: string | null;
  specs?: Record<string, string>;
  variants: IProductVariant[];
  minPrice: number;
  maxPrice: number;
  specialPrice: number;
  hasDiscount: boolean;
  totalStock: number;
  inStock: boolean;
  status: 'active' | 'inactive';
  variantCount: number;
  mainImage?: string;
  images?: string[];
  whiteBackgroundImage?: string;
}

// Update Product Payload
export type IUpdateProductPayload = Partial<ICreateProductPayload>;

// Admin Overview Response
export interface IAdminOverview {
  totalProducts: number;
  totalActive: number;
  totalInactive: number;
  totalInStock: number;
  totalOutOfStock: number;
  totalVariants: number;
  totalWithDiscount: number;
  totalStockQuantity: number;
  avgMinPrice: number;
  avgMaxPrice: number;
}

// Category Statistics
export interface ICategoryStats {
  _id: string;
  productCount: number;
  totalStock: number;
  avgPrice: number;
}

// Admin Overview Full Response
export interface IAdminOverviewResponse {
  overview: IAdminOverview;
  categories: ICategoryStats[];
  lowStock: Array<{
    _id: string;
    name: string;
    totalStock: number;
    minPrice: number;
  }>;
  outOfStock: Array<{
    _id: string;
    name: string;
  }>;
  recentlyUpdated: Array<{
    _id: string;
    name: string;
    status: string;
    updatedAt: string;
  }>;
}

// Product Query Params
export interface IProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  skinType?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

// API Response wrapper
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}