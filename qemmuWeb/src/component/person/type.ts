export interface UpdateUserRequest {
  name: string | "";
  image: string | "";
  status: string | "";
  role: string | "";
}

export interface PatchUserParams {
  userId: string;
  section: string;
  data: UpdateUserRequest;
}
