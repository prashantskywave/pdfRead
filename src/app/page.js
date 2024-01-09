"use client";

import DataTable from "@/components/DataTable";
import PDFUploader from "@/components/PDFUploader";
import PdfViewerComponent from "@/components/PDFViewer";
import { useState } from "react";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [highlightedAreas, setHighlightedAreas] = useState([]);
  const [filex, setFilex] = useState(null);
  const [tableData, setTableData] = useState(null);

  const purchaseDate = new Date();
  const currentyear = purchaseDate.getFullYear();
  const currentmonth = purchaseDate.toLocaleString("default", {
    month: "short",
  });
  const currentday = purchaseDate.getDate().toString().padStart(2, "0");

  const Po_date = `${currentyear}/${currentmonth}/${currentday}/`;

  const handleUpload = (file) => {
    console.log(
      ".." +
        __dirname +
        "vmsaccounts/storage/uploads/purchaseOrder/" +
        `${Po_date}`
    );

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("filename");
    console.log("myParam :: ", myParam);

    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setFilex(file);
  };

  const handleAreaSelect = (area) => {
    setHighlightedAreas([...highlightedAreas, area]);
  };

  return (
    <div>
      <PDFUploader onUpload={handleUpload} />
      {!tableData && pdfUrl && (
        <PdfViewerComponent
          pdfUrl={pdfUrl}
          fileData={filex}
          onAreaSelect={handleAreaSelect}
          setTableData={setTableData}
        />
      )}
      {tableData && <DataTable data={tableData} />}
    </div>
  );
}
