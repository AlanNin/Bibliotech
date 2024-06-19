"use client";
import { MagnifyingGlassIcon, Bars4Icon } from "@heroicons/react/24/outline";
import Logo from "~/../public/assets/CarritoCompras.png";
import styles from "./index.module.css";
import Image from "next/image";
import { useState } from "react";
import Sidebar from "../sidebar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftItemsAndSearch}>
          <div className={styles.leftItems}>
            <Bars4Icon className={styles.barsIcon} onClick={toggleSidebar} />
            <div
              className={styles.logoContainer}
              onClick={() => router.push("/")}
            >
              <Image src={Logo} alt="Shopping Cart" width={48} height={48} />
              <h1 className={styles.appName}>Bibliotech</h1>
            </div>
          </div>

          <div className={styles.searchBar}>
            <input className={styles.searchInput} placeholder="Search" />
            <MagnifyingGlassIcon className={styles.searchIcon} />
          </div>
        </div>
        <SignedOut>
          <SignInButton>
            <div className={styles.signInButton}>Sign In</div>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className={styles.rightIcons}>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: 36,
                    height: 36,
                  },
                },
              }}
              afterSignOutUrl="/"
            />
          </div>
        </SignedIn>
      </div>

      {isSidebarOpen && (
        <div className={styles.sidebarContainer}>
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>
      )}
    </>
  );
};

export default Navbar;
