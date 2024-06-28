import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { BookCard } from "../book_card";
import styles from "./index.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 2100 },
    partialVisibilityGutter: 10,
    items: 11,
    slidesToSlide: 11,
  },
  desktop: {
    breakpoint: { max: 2100, min: 1880 },
    partialVisibilityGutter: 10,
    items: 8,
    slidesToSlide: 8,
  },
  laptop: {
    breakpoint: { max: 1880, min: 1280 },
    partialVisibilityGutter: 10,
    items: 5,
    slidesToSlide: 5,
  },
  tablet: {
    breakpoint: { max: 1280, min: 464 },
    partialVisibilityGutter: 10,
    items: 4,
    slidesToSlide: 4,
    swipeable: true,
    draggable: true,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    partialVisibilityGutter: 10,
    items: 3,
    slidesToSlide: 3,
    swipeable: true,
    draggable: true,
  },
};

type SliderProps = {
  content: any;
};

const Slider: React.FC<SliderProps> = ({ content }) => {
  return (
    <section id="carousel" className={styles.slider}>
      <Carousel
        responsive={responsive}
        draggable={true}
        swipeable={false}
        arrows={true}
        partialVisbile
        customLeftArrow={
          <div className={`${styles.customArrow} ${styles.leftArrow}`}>
            <ChevronLeftIcon
              className={`${styles.arrowIcon}`}
              strokeWidth={2.5}
            />
          </div>
        }
        customRightArrow={
          <div className={`${styles.customArrow} ${styles.rightArrow}`}>
            <ChevronRightIcon
              className={`${styles.arrowIcon}`}
              strokeWidth={2.5}
            />
          </div>
        }
      >
        {content.map((content: any, index: number) => (
          <BookCard key={index} book={content} />
        ))}
      </Carousel>
    </section>
  );
};

export default Slider;
