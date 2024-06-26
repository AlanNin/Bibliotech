"use client";
import { MagnifyingGlassIcon, Bars4Icon } from "@heroicons/react/24/outline";
import Logo from "~/../public/assets/xdLogo.svg";
import styles from "./index.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Inputs = {
  search: string;
};

const Navbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputs, setInputs] = useState<Inputs>({
    search: "",
  });
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSearch = () => {
    if (inputs.search.length > 0) {
      router.push(`/search/${inputs.search}`);
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
    <>
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
              name="search"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && handleSearch) {
                  handleSearch();
                }
              }}
            />
            <MagnifyingGlassIcon
              className={styles.searchIcon}
              onClick={handleChange}
            />
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
