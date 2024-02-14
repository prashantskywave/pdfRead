import React, { useState } from "react";
const DataTable = ({ data, fileName }) => {
  const [tableData, setTableData] = useState(data);
  const [notification, setNotification] = useState(null);
  const [extTable, setExtTable] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

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
    showNotification("Deleted Successfully", "success");
    setTableData({ data: updatedData });
  };

  const handleTableCorrectClick = () => {
    setIsSubmiting(true);
    const headers = tableData.data[0]?.split(",") || [];
    const barcodeIndex = headers.indexOf("BARCODE");
    const qtyIndex = headers.indexOf("QTY");
    const unitAmountIndex = headers.indexOf("UNIT AMOUNT");
  
    if (barcodeIndex === -1 || qtyIndex === -1 || unitAmountIndex === -1) {
      showNotification(
        "Error: Barcode, QTY, or Unit Amount column not found in the table.",
        "error"
      );
      setIsSubmiting(false);
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

        setTimeout(() => {
          setIsSubmiting(false);
          setExtTable(true);
        }, 1000);
      } catch (error) {
        setTimeout(() => {
          setIsSubmiting(false);
          setExtTable(false);
        }, 1000);
      }
    };

    response(convertedData);
    // console.log("convertedData", convertedData);
  };

  return (
    <div className="overflow-hidden m-5">
      <div className="">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Note:</h2>

        <ul className="list-none p-0">
          <li className=" text-sm">
            Point 1:{" "}
            <strong className="uppercase">
              <span className=" text-red-600">*</span>QTY
            </strong>{" "}
            for Quantity/units, and etc.{" "}
          </li>
          <li className=" text-sm">
            Point 2:{" "}
            <strong className="uppercase">
              <span className=" text-red-600">*</span>Barcode
            </strong>{" "}
            for EAN/code/product code, and etc
          </li>
          <li className=" text-sm">
            Point 3:{" "}
            <strong className="uppercase">
              <span className=" text-red-600">*</span>unit amount
            </strong>{" "}
            for unit amount/price, and etc
          </li>
          <li className=" text-sm">
            Point 4:{" "}
            <strong className="uppercase">
              <span className=" text-red-600">*</span>vat
            </strong>{" "}
            for vat
          </li>
          <li className="text-sm italic mt-2 text-black font-extrabold"><span className=" text-red-600">**</span>All Cells are <span className="bg-blue-300 text-white px-1">Editable</span>.</li>
        </ul>
      </div>
      {tableData && (
        <div className="w-full overflow-scroll h-[30rem] pt-4">
          <table className=" border-collapse w-full border-b-2">
            <thead className=" sticky top-0">
              <tr>
                {tableData.data[0]?.split(",").map((header, index) => (
                  <th
                    key={index}
                    className="border border-solid border-gray-300 p-0 text-center bg-blue-600 text-white uppercase max-w-fit"
                  >
                    <input
                      type="text"
                      className={`w-full m-0 py-1 px-3 text-center text-uppercase bg-blue-600 border-none text-white outline-none text-sm`}
                      value={header}
                      onChange={(e) => handleHeaderEdit(index, e.target.value)}
                      onBlur={() =>
                        showNotification(
                          `Column updated successfully to ${header.toUpperCase()}`,
                          "success"
                        )
                      }
                    />
                  </th>
                ))}
                <th className="border border-solid border-gray-300 p-0 text-center bg-blue-600 text-white uppercase text-sm px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.data?.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.split(",").map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-solid py-0 px-2 text-left"
                    >
                      <input
                        className="border-none outline-none w-full text-sm"
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleCellEdit(
                            rowIndex + 1,
                            cellIndex,
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          showNotification(
                            `${cell} Updated Successfully`,
                            "success"
                          )
                        }
                      />
                    </td>
                  ))}
                  <td className=" border-t-[1px] py-0 px-2 flex justify-center" >
                    <div title={`Remove Row - ${row.split(",")[1]}`}>
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
                        className="color000 svgShape"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    </div>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={handleTableCorrectClick}
          className={`${isSubmiting?'bg-blue-200':'bg-blue-600'} text-white px-8 py-2 my-4 mr-14 rounded-md transition-all ease-in-out hover:bg-blue-500 font-bold`}
          disabled={isSubmiting}
        >
          Submit
        </button>
      </div>
      {/* Custom Notification */}
      {notification && (
        // <div
        //   style={{
        //     position: "fixed",
        //     top: "20px",
        //     right: "20px",
        //     padding: "10px",
        //     backgroundColor: getNotificationColor(notification.type),
        //     color: "#fff",
        //     borderRadius: "5px",
        //     boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
        //   }}
        // >
        //   {notification.message}
        // </div>
        <div
          className={`${getNotificationColor(
            notification.type
          )} border-l-4 p-4 rounded-lg absolute top-16 right-5`}
        >
          {/* <p className="text-lg font-semibold">Order Status: Confirmed</p> */}
          <p>{notification.message}</p>
        </div>
      )}
      {/* <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg absolute top-5 right-5">
          <p className="text-lg font-semibold">Order Status: Confirmed</p>
          <p>Your order has been successfully confirmed and is now being processed.</p>
      </div> */}
      {extTable && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-hidden">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="p-6 pt-0 flex flex-col justify-center items-center">
              <svg
                className=" w-20 h-20"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="green"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                We have Successfully fetch Data from PDF
              </h3>
            </div>
            <div
              className="absolute top-32 right-16 text-[10rem]"
              style={{
                transform: "rotateX(180deg) rotate(-55deg)",
                lineHeight: 0,
              }}
            >
              &#10552;
              {/* <div className=" relative">
              </div> */}
            </div>
            <p className=" absolute text-sm top-32 right-28 text-white">
              Go back to Purchase Order Page
            </p>
          </div>
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
      // return "red";
      return "bg-red-100 border-red-500 text-red-700";
    case "success":
      return "bg-green-100 border-green-500 text-green-700";
    // return "green";
    case "warning":
      return "bg-orange-100 border-orange-500 text-orange-700";
    // return "orange";
    default:
      return "bg-gray-100 border-gray-500 text-gray-700";
    // return "gray";
  }
};
