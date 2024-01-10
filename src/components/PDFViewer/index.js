"use client";
import React, { useCallback, useState } from "react";
import { ReactCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { NormalizedSelection, PdfViewer } from "react-pdf-selection";
import Tesseract from "tesseract.js";
import DataTable from "../DataTable";
import FormData from "form-data";
// const tabula = require("tabula-js");

const PdfViewerComponent = ({ pdfUrl, fileData, setTableData }) => {
  const [areaSelectionActive, setAreaSelectionActive] = useState(true);
  const [selections, setSelections] = useState([]);
  const [selectedArea, setSelectedArea] = useState({});
  const [extractedTable, setExtractedTable] = useState("");
  const formData = new FormData();

  const handleFileChangeAndApiCall = async (file) => {
    if (file) {
      try {
        const buffer = await readFileToBuffer(file);

        if (buffer) {
          try {
            formData.append("file", new Blob([buffer]));

            console.log(":Lol");
            const apiUrl = "https://apipoinvoice.onrender.com/api/fill"; // Replace with your API endpoint
            // const apiUrl = "http://localhost:6969/api/fill"; // Replace with your API endpoint

            fetch(apiUrl, {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => setTableData(data))
              .catch((error) => console.error("Error:", error));
          } catch (error) {
            console.error("Error sending file to the API:", error);
          }
        } else {
          console.error("Error reading file. Please try again.");
        }
      } catch (error) {
        console.error("Error reading file:", error);
      }
    } else {
      console.error("Please select a file first.");
    }
  };

  const setAndLogSelection = useCallback(
    async (highlightTip) => {
      const boundingRect = highlightTip?.position?.absolute?.boundingRect;

      if (boundingRect) {
        const area = {
          left: boundingRect.left,
          top: boundingRect.top,
          right: boundingRect.right,
          bottom: boundingRect.bottom,
        };
        console.log(area);
        console.log(JSON.stringify(area));
        // setSelectedArea(area);
        formData.append("area", JSON.stringify(area));
        handleFileChangeAndApiCall(fileData);
      } else {
        setSelectedArea(null);
      }
    },
    [fileData]
  );

  const Viewer = ({ document }) => {
    return <div>{document}</div>;
  };

  console.log(extractedTable);

  return (
    <>
      <PdfViewer
        url={pdfUrl}
        selections={[]}
        enableAreaSelection={useCallback(
          () => areaSelectionActive,
          [areaSelectionActive]
        )}
        onAreaSelection={setAndLogSelection}
        onTextSelection={setAndLogSelection}
      >
        {({ document }) => <Viewer document={document} />}
      </PdfViewer>

      {/* Pass the selected area to the DataTable component */}
      {/* {extractedTable.length > 0 && <DataTable data={extractedTable} />} */}
    </>
  );
};

export default PdfViewerComponent;

const readFileToBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const buffer = Buffer.from(arrayBuffer);
      resolve(buffer);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
