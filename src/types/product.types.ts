export interface CreateProductType {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  isActive?: boolean;
  categoryId: string;
}

export interface UpdateProducttype {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  categoryId?: string;
  isActive?: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

