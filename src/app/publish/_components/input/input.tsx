"use client";
import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import styles from "./input.module.css";

type InputProps = {
  label: string;
  name: string;
  placeholder: string;
  handleChange: (e: any) => void;
  handleSearch: () => void;
};

export const Input: React.FC<InputProps> = ({
  label,
  name,
  placeholder,
  handleChange,
  handleSearch,
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
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};
