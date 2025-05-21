"use client";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {" "}
      {/* <Navbar /> */}
      <main>{children}</main>
      <Toaster />
    </div>
  );
}

export default Wrapper;
