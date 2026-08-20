import {
  Injectable,
  signal,
  computed
} from '@angular/core';

import { Food } from './food.service';


export interface CartItem {
  food: Food;
  quantity: number;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {

  // ==================================================
  // STORAGE
  // ==================================================

  private readonly CART_STORAGE_KEY =
    'tastebite_cart';


  // ==================================================
  // CART STATE
  // ==================================================

  private cartItems =
    signal<CartItem[]>(
      this.loadCart()
    );


  items =
    this.cartItems.asReadonly();


  // ==================================================
  // TOTAL ITEMS
  // ==================================================

  totalItems = computed(() =>

    this.cartItems().reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  );


  // ==================================================
  // SUBTOTAL
  // ==================================================

  subtotal = computed(() =>

    this.cartItems().reduce(
      (total, item) =>
        total +
        item.food.price *
        item.quantity,
      0
    )

  );


  // ==================================================
  // LOAD CART
  // ==================================================

  private loadCart(): CartItem[] {

    try {

      const storedCart =
        localStorage.getItem(
          this.CART_STORAGE_KEY
        );


      if (!storedCart) {

        return [];

      }


      const parsedCart =
        JSON.parse(storedCart);


      if (!Array.isArray(parsedCart)) {

        return [];

      }


      return parsedCart;

    } catch (error) {

      console.error(
        'Failed to load cart from localStorage:',
        error
      );

      return [];

    }

  }


  // ==================================================
  // SAVE CART
  // ==================================================

  private saveCart(
    items: CartItem[]
  ): void {

    try {

      localStorage.setItem(
        this.CART_STORAGE_KEY,
        JSON.stringify(items)
      );

    } catch (error) {

      console.error(
        'Failed to save cart to localStorage:',
        error
      );

    }

  }


  // ==================================================
  // ADD TO CART
  // ==================================================

  addToCart(
    food: Food,
    quantity: number = 1
  ): void {

    if (quantity <= 0) {

      return;

    }


    const existingItem =
      this.cartItems().find(
        item =>
          item.food.id === food.id
      );


    if (existingItem) {

      this.cartItems.update(
        items =>

          items.map(
            item =>

              item.food.id === food.id

                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      quantity
                  }

                : item
          )

      );

    } else {

      this.cartItems.update(
        items => [

          ...items,

          {
            food,
            quantity
          }

        ]

      );

    }


    this.saveCart(
      this.cartItems()
    );

  }


  // ==================================================
  // UPDATE QUANTITY
  // ==================================================

  updateQuantity(
    foodId: number,
    quantity: number
  ): void {

    if (quantity <= 0) {

      this.removeFromCart(
        foodId
      );

      return;

    }


    this.cartItems.update(
      items =>

        items.map(
          item =>

            item.food.id === foodId

              ? {
                  ...item,
                  quantity
                }

              : item

        )

    );


    this.saveCart(
      this.cartItems()
    );

  }


  // ==================================================
  // REMOVE FROM CART
  // ==================================================

  removeFromCart(
    foodId: number
  ): void {

    this.cartItems.update(
      items =>

        items.filter(
          item =>
            item.food.id !== foodId
        )

    );


    this.saveCart(
      this.cartItems()
    );

  }


  // ==================================================
  // CLEAR CART
  // ==================================================

  clearCart(): void {

    this.cartItems.set([]);

    this.saveCart([]);

  }

}