import { memo } from "react";
// CSS import.
import styles from "./DrinksSummary.module.css";

function DrinksSummary() {
  return (
    <section className={styles.summary}>
      <h2>Đặt đồ uống mang đi!</h2>
      <p>
        Đồ uống espresso của chúng tôi được pha chế bởi các nghệ sĩ pha chế tuyệt vời bằng cách sử dụng hạt cà phê chất lượng cao.
      </p>
    </section>
  );
}
export default memo(DrinksSummary);
