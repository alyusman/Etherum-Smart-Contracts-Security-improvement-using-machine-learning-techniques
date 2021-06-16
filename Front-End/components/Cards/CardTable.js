import React from "react";
import MUIDataTable from "mui-datatables";

export default function CardTable(props) {
  const data = props.data;

  const columns = [
    {
      name: "",
      label: "#",
      options: {
        filter: false, sort: false,
        customBodyRender: (value, tableMeta, update) => {
          let rowIndex = Number(tableMeta.rowIndex) + 1;
          return (<span>{rowIndex}</span>)
        }
      },
    },
    {
      name: "fileName",
      label: "File Name",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "createdAt",
      label: "Date",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (index) => {
          return (
            <React.Fragment>
              <a
                target="_BLANK"
                href={`${process.env.NEXT_PUBLIC_API}user/downloadTestReport/${data[index]?.id}`}
                className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                Get Report
                          </a>
            </React.Fragment>
          );
        }
      }
    },
  ];
  const options = {
    print: false,
    filter: false,
    download: false,
    viewColumns: false,
    search: false,
    pagination: false,
    selectableRows: false,
  };
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700 text-white" 
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " 
                }
              >
                All Tests
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <React.Fragment>
            <MUIDataTable
              data={data}
              columns={columns}
              options={options}
            />
          </React.Fragment>
        </div>
      </div>
    </>
  );
}
