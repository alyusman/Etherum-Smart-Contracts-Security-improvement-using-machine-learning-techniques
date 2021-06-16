import React, { useState, useEffect } from "react";
import cookie from 'js-cookie';
import axios from "../../components/Services"
import CardTable from "components/Cards/CardTable.js";
import Notiflix from "notiflix";

export default function CardTests() {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [data, setData] = useState()
  const [status, setStatus] = useState(false)

  function createNow() {
    if (name != '' && file != null) {
      setStatus(true)
      let body = new FormData();
      body.append("name", name);
      body.append("file", file[0]);

      axios.createTest(body)
        .then(res => {
          fetchJobs();
          setStatus(false)
          Notiflix.Notify.success('New test created');
        }).catch(err => {
          setStatus(false)
          Notiflix.Notify.failure('Unable to create a new test');
        })
    } else {
      Notiflix.Notify.failure('Unable to create a new test');
    }
  }
  function fetchJobs() {
    if (cookie.get('role') == 2) {
      axios.adminTests()
        .then(res => {
          setData(res.data.result.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1))
        })
    } else {
      axios.userTests()
        .then(res => {
          setData(res.data.result.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1))
        })
    }
  }
  useEffect(() => {
    fetchJobs()
  }, []);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Create New Test</h6>
            <button
              disabled={status}
              onClick={() => { createNow() }}
              className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
            >
              {
                status &&
                <div class="example">
                  <span class="smooth spinner" /> &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
              }
              Create New Test
            </button>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <div className="flex flex-wrap mt-5">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Test Name
                  </label>
                  <input
                    onChange={(e) => { setName(e.target.value) }}
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Test File
                  </label>
                  <input
                    onChange={(e) => { setFile(e.target.files) }}
                    type="file"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
      <CardTable data={data} />
    </>
  );
}
