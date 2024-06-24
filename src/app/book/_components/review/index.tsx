"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import styles from "./index.module.css";
import { ReviewInput } from "./input";
import { ReviewItem } from "./item";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import {
  createComment,
  deleteComment,
  getCommentFromBookId,
  updateComment,
} from "~/server/queries/comment.queries";
import { toast } from "react-toastify";
import NoCommentsIlustration from "~/../public/assets/NoCommentsIlustration.webp";
import Image from "next/image";

type ReviewProps = {
  bookId: number;
};

interface Inputs {
  review: string;
}

export const Review: React.FC<ReviewProps> = ({ bookId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<any>([]);
  const [inputs, setInputs] = useState<Inputs>({
    review: "",
  });

  const fetchReviews = async () => {
    try {
      const reviews = await getCommentFromBookId(bookId);
      setReviews(reviews);
      setIsLoading(false);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchReviews();
  }, []);

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async () => {
    try {
      await createComment(inputs.review, bookId);
      setInputs({
        review: "",
      });
      fetchReviews();
      toast.success("Review posted successfully");
    } catch (error) {
      toast.error("Error posting review");
    }
  };

  const handleEditReview = async (reviewId: number, reviewText: string) => {
    try {
      if (reviewText.length > 0) {
        await updateComment(reviewId, reviewText);
        fetchReviews();
        toast.success("Review edited successfully");
      } else {
        toast.success("No changes detected");
      }
    } catch (error) {
      toast.error("Error deleting review");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteComment(reviewId);
      fetchReviews();
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Error deleting review");
    }
  };

  return (
    <>
      {isLoading ? (
        <div>
          <div className={styles.loadingContainer}>
            <ReactLoading type="bars" color="#1e608e" height={50} width={50} />
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>
            Reviews
            <SignedOut>
              <span className={styles.signToComment}>
                (Sign in to comment on this book)
              </span>
            </SignedOut>
          </h1>
          <SignedIn>
            <ReviewInput
              inputs={inputs}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </SignedIn>
          {reviews.length > 0 ? (
            <div className={styles.reviewsContainer}>
              {reviews.map((review: any, index: number) => (
                <ReviewItem
                  key={index}
                  review={review}
                  handleEditReview={handleEditReview}
                  handleDeleteReview={handleDeleteReview}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noReviewsContainer}>
              <Image
                alt="Ilustration"
                src={NoCommentsIlustration}
                className={styles.noReviewsIlustration}
              />
              <div className={styles.noReviewsTexts}>
                <h2 className={styles.noReviewsTitle}>No reviews yet</h2>
                <p className={styles.noReviewsSubTitle}>
                  Be the first to review this book
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
