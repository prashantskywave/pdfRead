import React, { useState } from "react";
const DataTable = ({ data, fileName }) => {
  const [tableData, setTableData] = useState(data);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Close the notification after 3 seconds
  };

  const handleCellEdit = (rowIndex, cellIndex, value) => {
    const updatedData = tableData.data.map((row, rIndex) =>
      rIndex === rowIndex
        ? row
            .split(",")
            .map((cell, cIndex) => (cIndex === cellIndex ? value : cell))
            .join(",")
        : row
    );
    setTableData({ data: updatedData });
  };

  const handleHeaderEdit = (headerIndex, value) => {
    const updatedHeaders = tableData.data[0]
      ?.split(",")
      .map((header, index) =>
        index === headerIndex ? value.toUpperCase() : header.toUpperCase()
      );
    const updatedData = [updatedHeaders.join(","), ...tableData.data.slice(1)];
    showNotification(`${value.toUpperCase()} is Updating`, "warning");
    setTableData({ data: updatedData });
  };

  const convertRowToObject = (row, headers) => {
    const rowValues = row.split(",");
    const rowData = {};
    headers.forEach((header, index) => {
      const camelCaseHeader = header
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
      rowData[camelCaseHeader] = rowValues[index] || "";
    });

    return rowData;
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = tableData.data.filter(
      (row, rIndex) => rIndex !== rowIndex + 1
    );
    setTableData({ data: updatedData });
  };

  const handleTableCorrectClick = () => {
    const headers = tableData.data[0]?.split(",") || [];
    const barcodeIndex = headers.indexOf("BARCODE");

    if (barcodeIndex === -1) {
      showNotification(
        "Error: Barcode column not found in the table.",
        "error"
      );
      return;
    }
    const convertedData = tableData.data
      .slice(1)
      .map((row) => convertRowToObject(row, headers));

    // const apiUrl = `http://localhost:6969/api/getPoData`;
    const apiUrl = `https://nodeapi.vmsaccounts.com/api/getPoData`;

    const response = async (convertedData) => {
      try {
        const fetchResponse = await fetch(apiUrl, {
          method: "POST",
          body: JSON.stringify({ poData: convertedData, fileName }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await fetchResponse.json();
        console.log(data);
        showNotification("Table data successfully submitted!", "success");
      } catch (error) {
        showNotification(
          `Error submitting table data:: ${error.message}`,
          "error"
        );
      }
    };

    response(convertedData);
    // console.log("convertedData", convertedData);
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {tableData && (
        <div>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr>
                {tableData.data[0]?.split(",").map((header, index) => (
                  <th
                    key={index}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                      backgroundColor: "#000",
                      color: "#fff",
                      textTransform: "uppercase",
                    }}
                    // contentEditable={true}
                    // onBlur={(e) =>
                    //   handleHeaderEdit(index, e.currentTarget.innerText)
                    // }
                  >
                    <input
                      type="text"
                      style={{
                        margin: "0",
                        padding: "10px",
                        textTransform: "uppercase",
                        backgroundColor: "#000",
                        border: "none",
                        color: "#fff",
                        outline: "none",
                      }}
                      value={header}
                      onChange={(e) => handleHeaderEdit(index, e.target.value)}
                    />
                  </th>
                ))}
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    backgroundColor: "#000",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.data?.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.split(",").map((cell, cellIndex) => (
                    // <td
                    //   key={cellIndex}
                    //   style={{
                    //     border: "1px solid #ddd",
                    //     padding: "8px",
                    //     textAlign: "left",
                    //   }}
                    // >
                    //   <div
                    //     contentEditable
                    //     onChange={(e) =>
                    //       handleCellEdit(
                    //         rowIndex + 1,
                    //         cellIndex,
                    //         e.currentTarget.innerText
                    //       )
                    //     }
                    //     dangerouslySetInnerHTML={{ __html: cell }}
                    //   />
                    // </td>
                    <td
                      key={cellIndex}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      <input
                        style={{
                          border: "none",
                          outline: "none",
                        }}
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleCellEdit(
                            rowIndex + 1,
                            cellIndex,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  ))}
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {/* <button > */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="25"
                      height="25"
                      onClick={() => handleDeleteRow(rowIndex)}
                      style={{ cursor: "pointer" }}
                    >
                      <path
                        d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z"
                        fill="#f00"
                        class="color000 svgShape"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    {/* </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <button onClick={handleTableCorrectClick}>Table is Correct</button>
      </div>
      {/* Custom Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px",
            backgroundColor: getNotificationColor(notification.type),
            color: "#fff",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default DataTable;

// Helper function to get the notification background color based on the type
const getNotificationColor = (type) => {
  switch (type) {
    case "error":
      return "red";
    case "success":
      return "green";
    case "warning":
      return "orange";
    default:
      return "gray";
  }
};
