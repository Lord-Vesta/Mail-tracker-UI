import { apiConfig } from "./api.config";
import axiosclient from "./axios-client";
const { USER_SINGUP, USER_LOGIN } = apiConfig;

export const signupUser = async (userData) => {
  try {
    const response = await axiosclient.post(USER_SINGUP, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const loginUser = async (userData) => {
  try {
    console.log("Logging in with:", userData);
    const response = await axiosclient.post(USER_LOGIN, userData);
    console.log(response, "response in loginUser api-----------");
    return response.data;
  } catch (error) {
    console.log(error, "error in loginUser api--------");
    throw error.response.data.message;
  }
};
