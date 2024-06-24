"use client";
import styles from "./input.module.css";

type InputProps = {
  inputs: any;
  handleChange: (e: any) => void;
  handleSubmit: () => void;
};

export const ReviewInput: React.FC<InputProps> = ({
  inputs,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className={styles.container}>
      <textarea
        placeholder="Write a review..."
        name="review"
        value={inputs.review}
        cols={10}
        rows={4}
        className={styles.textarea}
        onChange={handleChange}
      />
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};
