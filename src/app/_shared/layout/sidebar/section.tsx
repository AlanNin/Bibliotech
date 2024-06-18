"use client";
import styles from "./section.module.css";

interface SectionProps {
  Section: string;
  Icon: any;
}

interface ItemProps {
  Item: string;
  handleClick?: () => void;
}

export const Section: React.FC<SectionProps> = ({ Section, Icon }) => {
  return (
    <div className={styles.itemDiv}>
      <Icon className={styles.itemIcon} />
      <h1 className={styles.itemText}> {Section} </h1>
    </div>
  );
};

export const Item: React.FC<ItemProps> = ({ Item, handleClick }) => {
  return (
    <div className={styles.subItemDiv} onClick={handleClick}>
      <h1 className={styles.subItemText}> {Item} </h1>
    </div>
  );
};
