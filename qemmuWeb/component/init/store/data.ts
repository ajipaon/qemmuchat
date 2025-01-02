export enum sectionStatus {
  NEW_ORGANIZATION = "ORGANIZATION_NAME",
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
