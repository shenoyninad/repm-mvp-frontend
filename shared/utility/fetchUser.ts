import apiClient from "./api-util";
import { apiHeader } from "@config/config";

const fetchUserByUsername = async (email: any): Promise<any> => {
  const response = await apiClient.get(`/users?email=${email}`, apiHeader);
  return response;
};

export { fetchUserByUsername };
