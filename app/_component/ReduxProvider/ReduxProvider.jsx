"use client";
import React from "react";
import MyProvider from "../MyProvider/MyProvider";
import { store } from "@/redux/store";
export default function ReduxProvider({ children }) {
  return <MyProvider store={store}>{children}</MyProvider>;
}
