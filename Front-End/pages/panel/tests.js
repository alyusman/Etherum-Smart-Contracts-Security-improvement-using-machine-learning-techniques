import React from "react";
import CardTests from "components/Cards/CardTests.js";
import Admin from "layouts/Admin.js";

export default function Tests() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <CardTests />
        </div>
      </div>
    </>
  );
}

Tests.layout = Admin;
