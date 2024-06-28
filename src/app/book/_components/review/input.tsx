"use client";
import styles from "./input.module.css";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

type InputProps = {
  inputs: any;
  handleChange: (e: any) => void;
  handleSubmit: () => void;
  setRating: (rating: number) => void;
  rating: number;
};

export const ReviewInput: React.FC<InputProps> = ({
  inputs,
  handleChange,
  handleSubmit,
  setRating,
  rating,
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
      <div className={styles.lowerContainer}>
        <Rating style={{ maxWidth: 120 }} value={rating} onChange={setRating} />

        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
