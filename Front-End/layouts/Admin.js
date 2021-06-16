import React from "react";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import cookie from 'js-cookie';
import Redirect from '../components/Redirect'
import { useRouter } from 'next/router';

export default function Admin({ children }) {
  const router = useRouter();
  if ((router.pathname == "/auth/login" || router.pathname == "/auth/register") && cookie.get('accessToken') != null) return (<Redirect url='/dash' />);
  if ((router.pathname != "/auth/login" && router.pathname != "/auth/register") && cookie.get('accessToken') == null) return (<Redirect url='/' />);

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
        </div>
      </div>
    </>
  );
}
