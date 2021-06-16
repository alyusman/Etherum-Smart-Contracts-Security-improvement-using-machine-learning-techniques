import React, { useState, useEffect } from "react";
import cookie from 'js-cookie';
import CardStats from "components/Cards/CardStats.js";
import axios from "../../components/Services"

export default function HeaderStats() {
  const [role, setRole] = useState()

  const [stats, setStats] = useState({
    totalUsers: null,
    totalReports: null,
    totalTests: null,
  });

  useEffect(() => {
    setRole(cookie.get('role'))
    if (cookie.get('role') == 2) {
      axios.adminDash()
        .then(res => {
          setStats({
            totalReports: res.data.result.totalReports,
            totalTests: res.data.result.totalTests,
            totalUsers: res.data.result.totalUsers,
          });
        })
    } else {
      axios.dash()
        .then(res => {
          setStats({
            totalReports: res.data.result.totalReports,
            totalTests: res.data.result.totalTests,
          });
        })
    }

  }, []);
  return (
    <>
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                <CardStats
                  statSubtitle="Total Reports"
                  statTitle={stats.totalReports}
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                <CardStats
                  statSubtitle="Total Tests"
                  statTitle={stats.totalTests}
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {role == 2 &&
          <div className="px-4 md:px-10 mx-auto w-full mt-5">
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                  <CardStats
                    statSubtitle="Total Reports"
                    statTitle={stats.totalReports}
                    statIconName="far fa-chart-bar"
                    statIconColor="bg-red-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                  <CardStats
                    statSubtitle="Total Tests"
                    statTitle={stats.totalTests}
                    statIconName="far fa-chart-bar"
                    statIconColor="bg-red-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                  <CardStats
                    statSubtitle="Total Users"
                    statTitle={stats.totalUsers}
                    statIconName="far fa-chart-bar"
                    statIconColor="bg-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </div>

    </>
  );
}
