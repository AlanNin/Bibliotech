"use client";
import styles from "./index.module.css";
import AppLogo from "~/../public/assets/xdLogo.png";
import { useTable, Column } from "react-table";
import Image from "next/image";
import React from "react";
import { User } from "@clerk/nextjs/server";

type ProductSell = {
  orderNumber: number;
  detail: string;
  price: number;
  quantity: number;
  iva: number;
  subtotal: number;
  total: number;
};

const columns: Column<ProductSell>[] = [
  {
    Header: "#",
    accessor: "orderNumber",
  },
  {
    Header: "Product Details",
    accessor: "detail",
  },
  {
    Header: "Price",
    accessor: "price",
    Cell: ({ value }) => `$${value}`,
  },
  {
    Header: "Qty.",
    accessor: "quantity",
  },
  {
    Header: "IVA",
    accessor: "iva",
    Cell: ({ value }) => `$${value.toFixed(2)}`,
  },
  {
    Header: "Subtotal",
    accessor: "subtotal",
    Cell: ({ value }) => `$${value.toFixed(2)}`,
  },
  {
    Header: "Subtotal + IVA",
    accessor: "total",
    Cell: ({ value }) => `$${value.toFixed(2)}`,
  },
];

type InvoiceProps = {
  invoiceData: any;
};

export default function Invoice({ invoiceData }: InvoiceProps): JSX.Element {
  console.log(invoiceData);

  const invoiceDate = invoiceData?.FECHA_HORA;
  const date = new Date(invoiceDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const userFullName = invoiceData?.userFullName;
  const userEmail = invoiceData?.userEmail;
  const userPhone = invoiceData?.userPhone;
  const shippment = invoiceData?.ENVIO;
  const formattedDateLong = date.toLocaleDateString("en-US", options);
  const invoiceNo = invoiceData?.ID_VENTAS;
  const detail = invoiceData?.bookInfo?.TITULO;
  const price = invoiceData?.bookInfo?.PRECIO;
  const quantity = invoiceData?.CANTIDAD_LIBROS;
  const subtotal = invoiceData?.bookInfo?.PRECIO * invoiceData?.CANTIDAD_LIBROS;
  const iva = subtotal * 0.04; // 4%
  const total = subtotal + iva;
  const paymentReference = invoiceData?.ID_STRIPE;

  const data: ProductSell[] = [
    {
      orderNumber: 1,
      detail: detail,
      price: price,
      quantity: quantity,
      iva: iva,
      subtotal: subtotal,
      total: total,
    },
  ];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Image alt="App Logo" src={AppLogo} className={styles.logoPhoto} />
          <h1 className={styles.logoName}>Bibliotech</h1>
        </div>

        <div className={styles.leftSideHeader}>
          <div className={styles.rightItem}>
            <p className={styles.rightItemLabel}>Date</p>
            <p className={styles.rightItemValue}> {formattedDateLong} </p>
          </div>
          <div className={styles.separationLine}></div>
          <div className={styles.rightItem}>
            <p className={styles.rightItemLabel}>Invoice #</p>
            <p className={styles.rightItemValue}> BT-{invoiceNo} </p>
          </div>
        </div>
      </div>
      <div className={styles.sellerAndCustomerInfo}>
        <div className={styles.divInfo}>
          <p className={styles.infoTitle}>Bibliotech, e-Library</p>
          <p className={styles.infoLabel}>Phone Number: +1 (555) 555-5555</p>
          <p className={styles.infoLabel}>Representative: Alan Nin</p>
          <p className={styles.infoLabel}>Av. de Los Próceres 49</p>
          <p className={styles.infoLabel}>Santo Domingo, 10602</p>
        </div>
        <div className={styles.divInfo}>
          <p className={styles.infoTitle}>{userFullName}</p>
          <p className={styles.infoLabel}>Email: {userEmail}</p>
          {userPhone && userPhone.length > 0 && (
            <p className={styles.infoLabel}>Phone Number: {userPhone}</p>
          )}
          <p className={styles.infoLabel}>Shippement: {shippment}</p>
        </div>
      </div>
      <div className={styles.invoiceBody}>
        <div className={styles.tableContainer}>
          <table {...getTableProps()} className={styles.invoiceTable}>
            <thead className={styles.invoiceTableHead}>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.totalContainer}>
          <div className={styles.preTotal}>
            Net total:{" "}
            <span className={styles.preTotalValue}>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.preTotal}>
            IVA total:{" "}
            <span className={styles.preTotalValue}>${iva.toFixed(2)}</span>
          </div>
          <div className={styles.total}>
            Total: <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.paymentDetails}>
          <p className={styles.paymentDetailsTitle}>Payment Details</p>
          <p className={styles.paymentDetailsText}>
            Payment Reference: {paymentReference}
          </p>
        </div>

        <div className={styles.notes}>
          <p className={styles.notesTitle}>Notes</p>
          <p className={styles.notesText}>
            This transaction was processed securely using Stripe, a trusted
            payment gateway known for its advanced encryption and fraud
            prevention measures. Your financial information is protected,
            ensuring a safe and efficient payment experience. If you have any
            questions or concerns about this transaction, please contact our
            support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
