import React from "react";
import CardUsers from "components/Cards/CardUsers.js";
import Admin from "layouts/Admin.js";

export default function Users() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <CardUsers />
        </div>
      </div>
    </>
  );
}

Users.layout = Admin;
