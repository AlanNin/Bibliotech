"use client";
import { MagnifyingGlassIcon, Bars4Icon } from "@heroicons/react/24/outline";
import Logo from "~/../public/assets/xdLogo.svg";
import styles from "./index.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchInput.trim() !== "") {
      router.push(`/search/${searchInput}`);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.leftItemsAndSearch}>
        <div className={styles.leftItems}>
          <Bars4Icon className={styles.barsIcon} onClick={toggleSidebar} />
          <div
            className={styles.logoContainer}
            onClick={() => router.push("/")}
          >
            <Image src={Logo} alt="App Logo" className={styles.appLogo} />
            <h1 className={styles.appName}>Bibliotech</h1>
          </div>
        </div>

        <div className={styles.searchBar}>
          <input
            className={styles.searchInput}
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && handleSearchClick) {
                handleSearchClick();
              }
            }}
          />
          <MagnifyingGlassIcon
            className={styles.searchIcon}
            onClick={handleSearchClick}
          />
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
    </div>
  );
};

export default Navbar;
