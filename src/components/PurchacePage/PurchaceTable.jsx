import React from "react";
import { useTable, useSortBy } from "react-table";
import { FiChevronDown,FiChevronUp } from "react-icons/fi";

const PurchaceTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );
  return (
    <div className="w-full h-auto shadow-lg rounded-[12px] overflow-hidden">
      <div {...getTableProps()} className="flex flex-col rounded-lg">
        <div className="flex  bg-secondary text-white font-[300] text-[18px]">
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              className="flex  w-full p-2"
            >
              {headerGroup.headers.map((column, ind) => (
                <div
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={`flex-1 flex justify-center items-center gap-2 ${
                    ind !== headerGroups[0].headers.length - 1
                      ? "border-r-2 border-white"
                      : ""
                  } `}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <FiChevronDown size={22} />
                        : <FiChevronUp size={22} />
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="bg-white text-lg">
          {rows.map((row, ind) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps()}
                className={`flex ${
                  ind !== rows.length - 1
                    ? "border-b-2 border-b-borderGray"
                    : "py-4"
                }  py-3`}
              >
                {row.cells.map((cell) => {
                  return (
                    <div
                      {...cell.getCellProps()}
                      className="text-center flex-1"
                    >
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PurchaceTable;

// return (
//   <div className="w-full h-auto mt-5 rounded-lg overflow-hidden shadow-lg">
//     <table className="w-full">
//       <thead className="bg-secondary text-white">
//         <tr className="">
//           <th className="font-[300] p-2 ">DATE</th>
//           <th className="font-[300]  p-2 ">ITEM</th>
//           <th className="font-[300]  p-2 ">QUALITY</th>
//           <th className="font-[300] p-2 ">AMOUNT</th>
//           <th className="font-[300] p-2 ">PAYMENT</th>
//         </tr>
//       </thead>

//       <tbody className="bg-white w-full  ">
//         {data.map((item, ind) => (
//           <tr className={`border-b-2 border-borderGray`} key={ind}>
//             <td className="py-2 px-4 text-center text-[18px] ">10/07/23</td>
//             <td className="py-2 px-4 text-center text-[18px]">{item.item}</td>
//             <td className="py-2 px-4 text-center text-[18px]"></td>
//             <td className="py-2 px-4 text-center text-[18px]">{item.amount}</td>
//             <td className="py-2 px-4 text-center text-[18px]">{item.isPaid? "Paid":"Unpaid"}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );
