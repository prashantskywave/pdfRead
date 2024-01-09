import React, { useState } from "react";

const DataTable = ({ data }) => {
  const [editedData, setEditedData] = useState([]);

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const newData = [...editedData];
    newData[rowIndex] = newData[rowIndex] || {};
    newData[rowIndex][data.data[0].split(",")[cellIndex]] = value;
    setEditedData(newData);
  };

  const handleHeaderChange = (cellIndex, value) => {
    const newHeaders = [...data.data[0].split(",")];
    newHeaders[cellIndex] = value;

    const newData = editedData.map((row) => {
      const newRow = {};
      newHeaders.forEach((header, index) => {
        newRow[header] = row[newHeaders[index]];
      });
      return newRow;
    });

    setEditedData(newData);
  };

  console.log("editedData :: ", editedData);

  return (
    <div style={{ overflowX: "auto" }}>
      {data && (
        <div>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr>
                {data.data[0]?.split(",").map((header, index) => (
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
                      onChange={(e) =>
                        handleHeaderChange(index, e.target.value)
                      }
                    >
                      {data.data[0]?.split(",").map((option, optionIndex) => (
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
              {data.data?.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.split(",").map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                      contentEditable="true"
                      onBlur={(e) =>
                        handleCellChange(rowIndex, cellIndex, e.target.innerText)
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;
