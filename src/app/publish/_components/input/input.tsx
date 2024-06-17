"use client";
import React from "react";
import styles from "./input.module.css";

type InputProps = {
  label: string;
  name: string;
  placeholder: string;
  handleChange: (e: any) => void;
  handleSearch?: () => void;
  search?: boolean;
};

export const Input: React.FC<InputProps> = ({
  label,
  name,
  placeholder,
  handleChange,
  handleSearch,
  search,
}) => {
  return (
    <div className={styles.inputsContainer}>
      <label className={styles.inputLabel}> {label} </label>
      <div className={styles.inputAndButtonContainer}>
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          className={styles.input}
          onChange={(e) => {
            handleChange(e);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter" && handleSearch) {
              handleSearch();
            }
          }}
        />
        {search && (
          <button className={styles.searchButton} onClick={handleSearch}>
            Search
          </button>
        )}
      </div>
    </div>
  );
};
