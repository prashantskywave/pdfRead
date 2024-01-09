import React, { useState } from "react";
const formData = new FormData();

const DataTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  const handleCellEdit = (rowIndex, cellIndex, value) => {
    // console.log(rowIndex, cellIndex, value);
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

  const handleTableCorrectClick = () => {
    const headers = tableData.data[0]?.split(",") || [];
    const convertedData = tableData.data
      .slice(1)
      .map((row) => convertRowToObject(row, headers));

    const apiUrl = `${process.env.VMS_URL}api/getPoData`;
    const formData = new FormData();
    formData.append("poData", JSON.stringify(convertedData));

    const response = async (convertedData) => {
      try {
        console.log(formData.get("poData"));
        const res = await fetch(apiUrl, {
          method: "POST",
          body: JSON.stringify({ poData: convertedData }), // Wrap the data in an object
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        console.log("Res :: ", res);

        const data = await res.json();
        // Do something with the data
        console.log(data);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error.message);
      }
    };

    // Call the function to initiate the API request
    response(convertedData);
    console.log("Data stored in localStorage:", convertedData);
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
                    }}
                  >
                    <select
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                      }}
                      defaultValue={header}
                    >
                      {tableData.data[0]
                        ?.split(",")
                        .map((option, optionIndex) => (
                          <option
                            style={{ background: "black", color: "#fff" }}
                            key={optionIndex}
                            value={option}
                          >
                            {option}
                          </option>
                        ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.data?.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.split(",").map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      <div
                        contentEditable
                        onBlur={(e) =>
                          handleCellEdit(
                            rowIndex + 1,
                            cellIndex,
                            e.currentTarget.innerText
                          )
                        }
                        dangerouslySetInnerHTML={{ __html: cell }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <button onClick={handleTableCorrectClick}>Table is Correct</button>
      </div>
    </div>
  );
};

export default DataTable;
