"use client";

import DataTable from "@/components/DataTable";
import PDFUploader from "@/components/PDFUploader";
import PdfViewerComponent from "@/components/PDFViewer";
import { useEffect, useState } from "react";
// const path = require("path");
import path from "path";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [highlightedAreas, setHighlightedAreas] = useState([]);
  const [filex, setFilex] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [fileName, setFileName] = useState("");

  const purchaseDate = new Date();
  const currentyear = purchaseDate.getFullYear();
  const currentmonth = purchaseDate.toLocaleString("default", {
    month: "short",
  });
  const currentday = purchaseDate.getDate().toString().padStart(2, "0");

  const Po_date = `${currentyear}/${currentmonth}/${currentday}/`;

  // const handleUpload = (file) => {
  //   // console.log(
  //   //   ".." +
  //   //     __dirname +
  //   //     "vmsaccounts/storage/uploads/purchaseOrder/" +
  //   //     `${Po_date}`
  //   // );
  //   const url = URL.createObjectURL(file);
  //   console.log("file :: ", file);
  //   console.log("url :: ", url);
  //   setPdfUrl(url);
  //   setFilex(file);
  // };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("filename");
    const filePath = `https://vmsaccounts.com/storage/uploads/purchaseOrder/${Po_date}${myParam}`;

    // console.log("filePath :: ", filePath);
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch file (${response.status})`);
        }
        return response.blob();
      })
      .then((blob) => {
        // Extract file name from the URL
        const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        setFileName(fileName?.split(".")[0]);

        // Create a File object with the extracted name
        const file = new File([blob], fileName, { type: "application/pdf" });

        // Now you can use the 'file' object as needed
        // console.log("file :: ", file);

        // For example, create a URL for the File
        const url = URL.createObjectURL(file);
        // console.log("url :: ", url)running;
        setPdfUrl(url);
        setFilex(file);
      })
      .catch((error) => console.error("Error fetching file:", error));
  }, []);

  const handleAreaSelect = (area) => {
    setHighlightedAreas([...highlightedAreas, area]);
  };

  return (
    <div>
      {/* <PDFUploader onUpload={handleUpload} /> */}
      {!tableData && pdfUrl && (
        <PdfViewerComponent
          pdfUrl={pdfUrl}
          fileData={filex}
          onAreaSelect={handleAreaSelect}
          setTableData={setTableData}
        />
      )}
      {tableData && <DataTable data={tableData} fileName={fileName} />}
    </div>
  );
}
