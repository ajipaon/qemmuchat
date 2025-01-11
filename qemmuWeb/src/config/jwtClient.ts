/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  name: string;
  role: string;
  status: string;
  firstLogin: boolean;
  exp: number;
  last_organization: string;
}

export function deCodeJwt(token: string): any {
  if (token) {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error: any) {
      console.error("Invalid token:", error.message);
    }
  }
}
