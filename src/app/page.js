"use client";
import DataTable from "@/components/DataTable";
import PDFUploader from "@/components/PDFUploader";
import PdfViewerComponent from "@/components/PDFViewer";
// import OCRTable from "@/file/OCRTable";
// import PDFUploader from "@/file/PDFUploader";
// import PDFViewer from "@/file/PDFViewer";
import { useState } from "react";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [highlightedAreas, setHighlightedAreas] = useState([]);
  const [filex, setFilex] = useState(null);
  const [tableData, setTableData] = useState(null);
  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setFilex(file);
  };

  const handleAreaSelect = (area) => {
    setHighlightedAreas([...highlightedAreas, area]);
  };

  const handleAreaRemove = (area) => {
    const updatedAreas = highlightedAreas.filter((a) => a !== area);
    setHighlightedAreas(updatedAreas);
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
