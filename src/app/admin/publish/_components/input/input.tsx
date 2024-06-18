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
  format?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  name,
  placeholder,
  handleChange,
  handleSearch,
  search,
  format,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.charCode || e.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (format === "number" && !/^[0-9]$/.test(charStr)) {
      e.preventDefault();
    }

    if (format === "decimal" && !/^[0-9.]$/.test(charStr)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (format === "number" && /^[0-9]*$/.test(value)) {
      handleChange(e);
    } else if (format === "decimal" && /^[0-9]*\.?[0-9]*$/.test(value)) {
      handleChange(e);
    } else {
      handleChange(e);
    }
  };

  return (
    <div className={styles.inputsContainer}>
      <label className={styles.inputLabel}> {label} </label>
      <div className={styles.inputAndButtonContainer}>
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          className={styles.input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onKeyDown={(e) => {
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
