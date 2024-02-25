import dynamic from "next/dynamic";
import { m } from "framer-motion";
// My imports.
import styles from "./Admin.module.css";
import { pageAnimation } from "../../utils/animations/animation";
// My components.
import Card from "../UI/Card";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const AllOrders = dynamic(() => import("../AllOrders/AllOrders"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});


export default function Admin() {
  return (
    <m.div initial="in" animate="animate" variants={pageAnimation}>
      <Card style="container">
        <section className={styles.profile}>
          <h1>Quản lý đơn hàng</h1>
        </section>
      </Card>
      <AllOrders />
    </m.div>
  );
}
