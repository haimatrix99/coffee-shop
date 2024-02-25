import dynamic from "next/dynamic";
// My imports.
import type Order from "../../models/Order";
import styles from "./AllOrders.module.css";
import FetchItems from "../../store/fetcher/fetch-items";
// My components.
import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";
// Turn off ssr render for this component since it uses client side functions.
const DisplayAllOrders = dynamic(() => import("./DisplayAllOrders"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

type fetchOrderedReturnType = {
  items: Order[];
  isLoading: boolean;
  isError: Error | undefined;
};

export default function AllOrders() {
  const orderArray: Order[] = [];
  const { items, isLoading, isError }: fetchOrderedReturnType = FetchItems(
    "/api/all-orders",
    orderArray,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  if (isError) {
    // Error in fetching user's past orders.
    return (
      <Card style="displayContainer">
        <h2 className={styles.orderError}>{isError.message}</h2>
      </Card>
    );
  }
  if (isLoading) {
    // We are still loading user's past orders.
    return (
      <Card style="displayContainer">
        <h2>Đang tải lịch sử...</h2>
        <LoadingSpinner />
      </Card>
    );
  }

  if (items?.length === 0) {
    // User has no past orders.
    return (
      <Card style="displayContainer">
        <h2>Không có đơn hàng nào.</h2>
      </Card>
    );
  }

  // User has past orders
  return (
    <Card style="orderContainer">
      <DisplayAllOrders orders={items} />
    </Card>
  );
}
