// My imports.
import styles from "./Receipt.module.css";
import type DrinkItem from "../../models/DrinkItem";
import type Order from "../../models/Order";
// My component.
import ReceiptItem from "./ReceiptItem";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

/**
 * Gets the list of Receipt Item components.
 * @param {DrinkItem[]} items
 * @param {string} date local date string.
 * @returns An array of ReceiptItem components.
 */
function getReceiptItems(items: DrinkItem[], date: string): JSX.Element[] {
  const itemList = items.map((item: DrinkItem) => {
    return (
      <ReceiptItem
        key={item.name + ":" + date}
        name={item.name}
        price={item.price}
        qty={item.amount}
      />
    );
  });
  return itemList;
}

type ReceiptProps = {
  order: Order;
  showReceiptItems: boolean;
  showForAdmin: boolean;
  showFinishedButton: boolean;
};

export default function Receipt(props: ReceiptProps) {
  const formattedTotalPrice = `${props.order.totalPrice.toFixed(3)} VND`;
  const localDate = props.order.orderDate.toLocaleString();
  const summaryStyles = `${styles.summary} ${
    props.showReceiptItems ? styles.divider : ""
  }`;
  const {data: session} = useSession();
  const router = useRouter();
  
  const updateStatusOrder = (order_id: string | undefined) => {
    if (order_id) {
      axios({
        method: 'put',
        url: '/api/orders',
        data: {
          order_id: order_id,
        }
      }).then(
        r => router.reload()
      ).catch(
        e => console.log(e)
      );
      
    }
  }

  return (
    <div className={styles.receipt}>
      {props.showForAdmin && (
          <div className={styles.name}>
            <h3>Tên</h3>
            <span>{props.order.name}</span>
          </div>
      )}
      {props.showForAdmin && (
          <div className={styles.phoneNumber}>
            <h3>Số điện thoại</h3>
            <span>{props.order.phoneNumber}</span>
          </div>
      )}
      <div className={styles.date}>
        <h3>Ngày đặt hàng</h3>
        <time>
          <span>{localDate}</span>
        </time>
      </div>
      {props.showReceiptItems && (
        <section className={styles.receiptItems} title="Receipt Items">
          <ul>{getReceiptItems(props.order.items, localDate)}</ul>
        </section>
      )}
      <section className={summaryStyles} title="Total">
        <div className={styles.totalItems}>
          <h3>Tổng số lượng</h3>
          <span>{props.order.totalItems}</span>
        </div>
        <div className={styles.totalPrice}>
          <h3>Giá</h3>
          <span className={styles.price}>{formattedTotalPrice}</span>
        </div>
        <div className={styles.receiptFooter}>
          { props.order.isFinished ? 
          (<div className={styles.status}>
            <h3>Đã hoàn thành</h3>
          </div> ) : (<div className={styles.status}>
            <h3>Chưa hoàn thành</h3>
          </div>)}
          {(session && session.user.isAdmin && props.showFinishedButton ) && (
            <div className={styles.actions}>
              <button className={styles.finished} disabled={props.order.isFinished} onClick={() => updateStatusOrder(props.order.id)}>Hoàn thành đơn hàng</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
