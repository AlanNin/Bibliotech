"use client";
import { useUser } from "@clerk/nextjs";
import styles from "./item.module.css";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

type ReviewProps = {
  review: any;
  handleEditReview: (reviewId: number, reviewText: string) => void;
  handleDeleteReview: (reviewId: number) => void;
};

interface Inputs {
  editReview: string;
}

export const ReviewItem: React.FC<ReviewProps> = ({
  review,
  handleEditReview,
  handleDeleteReview,
}) => {
  const user = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputs, setInputs] = useState<Inputs>({
    editReview: "",
  });
  const isAuthor = user?.user?.id === review.ID_USUARIO;
  const menuRef = useRef<HTMLDivElement>(null);
  const ellipsisRef = useRef<SVGSVGElement>(null);

  // Close menu when click outside :b
  const handleClickOutsideMenu = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      ellipsisRef.current &&
      !ellipsisRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [menuRef]);

  // Edit review :b
  const toggleEditReview = () => {
    setIsMenuOpen(false);
    setIsEditing(true);
  };

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const editReview = () => {
    handleEditReview(review.ID_COMENTARIO, inputs.editReview);
    setIsEditing(false);
    setInputs({
      editReview: "",
    });
  };

  // Delete review :b
  const deleteReview = () => {
    handleDeleteReview(review.ID_COMENTARIO);
    setIsMenuOpen(false);
  };

  const reviewDate = new Date(review.FECHA_COMENTARIO);
  const formattedDate = formatDate(reviewDate);
  return (
    <div className={styles.container}>
      <img src={review.userImage} alt="User Avatar" className={styles.avatar} />
      <div className={styles.reviewContent}>
        <div className={styles.userName}>
          {review.userFullName}{" "}
          <span className={styles.reviewDate}> {formattedDate} </span>
          <Rating
            style={{ maxWidth: 80 }}
            value={review.RATING || 1}
            readOnly={true}
          />
          {isAuthor && (
            <div className={styles.ellipsisContainer}>
              <EllipsisHorizontalIcon
                width={20}
                height={20}
                className={styles.ellipsis}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                ref={ellipsisRef}
              />
              {isMenuOpen && (
                <div className={styles.reviewMenu} ref={menuRef}>
                  <button
                    className={styles.menuButton}
                    onClick={toggleEditReview}
                  >
                    <PencilIcon
                      width={16}
                      height={16}
                      className={styles.menuButtonIcon}
                    />
                    Edit Review
                  </button>
                  <button className={styles.menuButton} onClick={deleteReview}>
                    <TrashIcon
                      width={16}
                      height={16}
                      className={styles.menuButtonIcon}
                    />
                    Delete Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <div className={styles.editContainer}>
            <input
              className={styles.inputEdit}
              placeholder="Edit your review..."
              name="editReview"
              value={
                inputs.editReview === ""
                  ? review.DESCRIPCION_COMENTARIO
                  : inputs.editReview
              }
              onChange={handleChange}
            ></input>
            <button className={styles.editButton} onClick={editReview}>
              Edit
            </button>
          </div>
        ) : (
          <p className={styles.reviewText}>{review.DESCRIPCION_COMENTARIO}</p>
        )}
      </div>
    </div>
  );
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 10) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
};
