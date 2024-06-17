"use client";
import styles from "./index.module.css";
import {
  XMarkIcon,
  TagIcon,
  ShoppingBagIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import { Section, Item } from "./section";
import { useEffect, useState } from "react";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [animationClass, setAnimationClass] = useState("");
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => toggleSidebar(), 500);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      setAnimationClass(styles.open ?? "");
    } else {
      setAnimationClass(styles.close ?? "");
    }
  }, [isSidebarOpen]);

  return (
    <div className={`${styles.container} ${animationClass}`}>
      <div className={styles.wrapper}>
        <XMarkIcon className={styles.closeIcon} onClick={closeSidebar} />
        <SignedOut>
          <h1 className={styles.title}>New around here?</h1>
          <SignInButton>
            <div className={styles.signInButton}>Sign In</div>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <h1 className={styles.welcomeText}>Welcome, {user?.fullName}</h1>
        </SignedIn>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionItem}>
            <Section Section="Categories" Icon={TagIcon} />
            <Item Item="Action" />
            <Item Item="Thriller" />
            <Item Item="Comedy" />
            <Item Item="Romance" />
            <Item Item="Mistery" />
            <Item Item="Comics" />
            <Item Item="Science Fiction" />
          </div>
          <div className={styles.sectionItem}>
            <Section Section="Trending" Icon={ShoppingBagIcon} />
            <Item Item="Best Sellers" />
            <Item Item="Trending Now" />
            <Item Item="New Releases" />
          </div>
          <div className={styles.sectionItem}>
            <Section Section="Our Recommendation" Icon={GiftIcon} />
            <Item Item="Users favorite" />
            <Item Item="Best Offers" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
