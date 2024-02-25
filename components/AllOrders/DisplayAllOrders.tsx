import { useState, Fragment, useCallback } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";
// My imports.
import styles from "./DisplayAllOrders.module.css";
import type Order from "../../models/Order";
// My components.
import AllOrderList from "./AllOrderList";
import Modal from "../UI/Modal";
import Receipt from "../Receipt/Receipt";

type DisplayAllOrdersProps = {
  orders: Order[];
};

const OverlayElement = document.querySelector("#overlays") as HTMLElement;

export default function DisplayAllOrders(props: DisplayAllOrdersProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [modalOrderReceipt, setModalOrderReceipt] = useState<Order | null>(
    null
  );

  const showDetailedReceipt = (order: Order) => {
    // Shows a full detailed receipt on the modal component.
    setShowReceipt(true);
    setModalOrderReceipt(order);
  };

  const closeDetailedReceipt = useCallback(() => {
    setModalOrderReceipt(null);
    setShowReceipt(false);
  }, []);

  return (
    <Fragment>
      <AllOrderList
        orders={props.orders}
        onShowReceipt={showDetailedReceipt}
      />
      {ReactDOM.createPortal(
        <AnimatePresence>
          {showReceipt && modalOrderReceipt && (
            <Modal onClose={closeDetailedReceipt}>
              <Receipt order={modalOrderReceipt} showReceiptItems={true} />
              <div className={styles.actions}>
                <button onClick={closeDetailedReceipt}>Close</button>
              </div>
            </Modal>
          )}
        </AnimatePresence>,
        OverlayElement
      )}
    </Fragment>
  );
}
