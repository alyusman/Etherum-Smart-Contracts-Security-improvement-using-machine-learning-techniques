import React, { useState } from "react";
import Link from "next/link";
import Auth from "layouts/Auth.js";
import axios from "../../components/Services"
import Router from 'next/router';
import cookie from 'js-cookie';

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [error, setError] = useState({ state: false, msg: "" })
  const [btn, setBtn] = useState(false)

  function register() {
    setError({ state: false })
    setBtn(true)
    if ((password == confirmPass) && (password != "" && confirmPass != "")) {
      axios.register({ email: email, password: password })
        .then(res => {
          setBtn(false)
          if (res.data.code == 200) {
            cookie.set('new', 1);
            Router.push('/auth/login')
          }else{
            setError({ state: true, msg: "Oops something went wrong!" })
          }
        }).catch(err => {
          setBtn(false)
          setError({ state: true, msg: err.response.data.message })
        })
    } else {
      setBtn(false)
      setError({ state: true, msg: "Password doesn't match, please try again." })
    }

  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            {error.state &&
              <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-500">
                <span className="inline-block align-middle mr-8">
                  {error.msg}
                </span>
              </div>
            }
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-5">
                <form>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      onChange={(e) => { setEmail(e.target.value) }}
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      onChange={(e) => { setPassword(e.target.value) }}
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                    />
                  </div>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Confirm Password
                    </label>
                    <input
                      onChange={(e) => { setConfirmPass(e.target.value) }}
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                    />
                  </div>
                  <div className="text-center mt-6">
                    <button
                      disabled={btn}
                      onClick={() => { register() }}
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">

              </div>
              <div className="w-1/2 text-right">
                <Link href="/auth/login">
                  <a href="#pablo" className="text-blueGray-200">
                    <small>Sigin into account</small>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = Auth;
