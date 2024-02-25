import type Order from "./Order";

interface Receipt extends Order {
  name: string;
  phoneNumber: string;
}

export default Receipt;
