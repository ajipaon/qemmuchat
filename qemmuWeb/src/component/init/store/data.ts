export enum sectionStatus {
  NEW_APP = "APP_NAME",
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
}

export type dataConfig = {
  data: string | null;
  name: sectionStatus;
};

export type registerUser = {
  email: string;
  name: string;
  password: string;
};

export type loginUser = {
  email: string;
  password: string;
};
