import type { BilaoSize, Dish, DishPrice } from '@/domain/entities';

export interface IMenuRepository {
  getDishes(includeInactive?: boolean): Promise<Dish[]>;
  getSizes(includeInactive?: boolean): Promise<BilaoSize[]>;
  getDishPrices(): Promise<DishPrice[]>;
  createDish(name: string): Promise<Dish>;
  updateDish(id: string, name: string): Promise<Dish>;
  deactivateDish(id: string, isActive: boolean): Promise<void>;
  createSize(name: string): Promise<BilaoSize>;
  updateSize(id: string, name: string): Promise<BilaoSize>;
  deactivateSize(id: string, isActive: boolean): Promise<void>;
  upsertPrice(dishId: string, sizeId: string, unitPrice: number): Promise<DishPrice>;
}
