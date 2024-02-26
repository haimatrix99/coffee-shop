// My import.
import type DrinkItem from "./DrinkItem";

interface Order {
  id?: string;
  items: DrinkItem[];
  name: string;
  phoneNumber: string;
  totalItems: number;
  totalPrice: number;
  orderDate: Date;
  isFinished: boolean;
}

export default Order;
