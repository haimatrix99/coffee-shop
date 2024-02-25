import { useState, useRef } from "react";
// My imports.
import styles from "./GuestCheckout.module.css";
import type User from "../../../models/User";
import { isValidPhoneNumber, isValidName } from "utils/validation/input_validation";
// My component.
import CheckoutFormButtons from "./CheckoutFormButtons";

type GuestCheckoutProps = {
  onCancel: () => void;
  onClose: () => void;
  onConfirm: (userData: User) => Promise<void>;
};

export default function GuestCheckout(props: GuestCheckoutProps) {
  const [formInputValid, setFormInputValid] = useState({
    firstName: true,
    lastName: true,
    phoneNumber: true,
  });

  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const phoneNumberInputRef = useRef<HTMLInputElement>(null);

  const confirmHandler = (event: React.FormEvent) => {
    event.preventDefault();

    // Get user inputs.
    const enteredFirstName = firstNameInputRef.current
      ? firstNameInputRef.current.value
      : "";
    const enteredLastName = lastNameInputRef.current
      ? lastNameInputRef.current.value
      : "";
    const enteredPhoneNumber = phoneNumberInputRef.current
      ? phoneNumberInputRef.current.value
      : "";

    // Validate user inputs.
    const enteredFirstNameIsValid = isValidName(enteredFirstName);
    const enteredLastNameIsValid = isValidName(enteredLastName);
    const enteredPhoneNumberIsValid = isValidPhoneNumber(enteredPhoneNumber);

    // Save validation for user validation feedback.
    setFormInputValid({
      firstName: enteredFirstNameIsValid,
      lastName: enteredLastNameIsValid,
      phoneNumber: enteredPhoneNumberIsValid,
    });
    const formIsValid =
      enteredFirstNameIsValid && enteredLastNameIsValid && enteredPhoneNumberIsValid;
    if (!formIsValid) {
      // Do not submit form if inputs are invalid.
      return;
    }

    // Save user info data to send to database.
    const userInfo: User = {
      phoneNumber: enteredPhoneNumber,
      firstName: enteredFirstName,
      lastName: enteredLastName,
    };

    props.onConfirm(userInfo);
  };

  // Get the input classes depending on the input validity.
  const firstNameClasses = `${styles.control} ${
    formInputValid.firstName ? "" : styles.invalid
  }`;
  const lastNameClasses = `${styles.control} ${
    formInputValid.lastName ? "" : styles.invalid
  }`;
  const phoneNumberClasses = `${styles.control} ${
    formInputValid.phoneNumber ? "" : styles.invalid
  }`;

  return (
    <form className={styles.form} onSubmit={confirmHandler}>
      <div className={firstNameClasses}>
        <label htmlFor="first-name">Họ</label>
        <input type="text" id="first-name" ref={firstNameInputRef} />
        {!formInputValid.firstName && <p>Xin vui lòng nhập đúng họ</p>}
      </div>
      <div className={lastNameClasses}>
        <label htmlFor="last-name">Tên</label>
        <input type="text" id="last-name" ref={lastNameInputRef} />
        {!formInputValid.lastName && <p>Xin vui lòng nhập đúng tên</p>}
      </div>
      <div className={phoneNumberClasses}>
        <label htmlFor="phoneNumber">Số điện thoại</label>
        <input
          type="phoneNumber"
          id="phoneNumber"
          ref={phoneNumberInputRef}
          placeholder="0123456789"
        />
        {!formInputValid.phoneNumber && <p>Xin vui lòng nhập đúng sô điện thoại.</p>}
      </div>
      <CheckoutFormButtons onClose={props.onClose} onCancel={props.onCancel} />
    </form>
  );
}
