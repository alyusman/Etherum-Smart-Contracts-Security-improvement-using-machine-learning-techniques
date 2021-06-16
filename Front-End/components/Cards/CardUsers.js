import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from '../Services'
import Notiflix from "notiflix";

export default function Users() {
  const [state, setState] = useState({ users: [] });
  const [status, setStatus] = useState(false)
  function fetchUsers() {
    axios.users()
      .then(res => {
        setState({ users: res.data.result })
      }).catch(err => {

      })
  }
  function processUser(_userId, _action) {
    setStatus(true)
    axios.processUser({ userId: _userId, value: _action })
      .then(res => {
        fetchUsers()
        setStatus(false)
        Notiflix.Notify.success('User updated');
      }).catch(err => {
        setStatus(false)
        Notiflix.Notify.failure('Something wrong!');
      })
  }
  useEffect(() => {
    fetchUsers()
  }, []);
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
      name: "name",
      label: "Name",
      options: {
        filter: false, sort: false,
        customBodyRender: (value, tableMeta, update) => {
          let rowIndex = Number(tableMeta.rowIndex) + 1;
          return (<span>{value ? value : '-'}</span>)
        }
      },
    },
    {
      name: "email",
      label: "Email",
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
              {
                state?.users[index]?.isActive == 1 &&
                <button
                  disabled={status}
                  className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={() => {
                    processUser(state?.users[index]?.id, 0)
                  }}>
                  Deactivate
                                </button>
              }
                            &nbsp;&nbsp;
              {
                state?.users[index]?.isActive == 0 &&
                <button
                  disabled={status}
                  className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={() => {
                    processUser(state?.users[index]?.id, 1)
                  }}>
                  Activate
                                </button>
              }
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
      <div className="mb-0">&nbsp;</div>
      <div className="mt-5">
        <MUIDataTable
          data={state.users}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
}
