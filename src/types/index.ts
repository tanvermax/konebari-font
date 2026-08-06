import type { ComponentType } from "react";

export type { ILogin, IVerifyOtp, ISendOtp } from "./auth.types";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
export interface ISidebarItem {
  title?: string;
  url: string;
  // icon: string | ComponentType, // icon can be a string or a React component

  items: {
    title: string;
    url: string;
    icon?: string | ComponentType; // icon can be a string or a React component
    component: ComponentType;
  }[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER";
