/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log(BACKEND_URL);

// console.log(BACKEND_URL)

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${BACKEND_URL}/auth/register`,
      { username, email, password },
    );
    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Signup failed";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
};



export const login = async (username: string, password: string) => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${BACKEND_URL}/auth/login`,
      { username, password },
    );
    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Login failed";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
};

export const logout = async () => {
  const token = localStorage.getItem("refreshToken");

  try {
    await axios.post(`${BACKEND_URL}/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Logout failed";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }

  // Clear frontend session
  localStorage.removeItem("refreshToken");
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("refreshToken"); // ✅ Get the token
    if (!token) {
      console.error("No access token found in localStorage");
      return false;
    }

    const response = await axios.get(`${BACKEND_URL}/users/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  } catch (error: any) {
    console.log(error)
    const errorMessage = error.response?.data?.message || "Authentication check failed";
    if (error.response?.status === 429) {
      alert("Too many requests. Please wait a while before trying again.");
    }
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
};
export const getUserInfo = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/dashboard`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      }
    }); // Replace with your actual protected endpoint
    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Fetching User Info Failed";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
};

// export const resetPassword = async({resetToken, newPassword}: {resetToken: string, newPassword: string}): Promise<any> => {

//   try {

//  } catch (error) {
// console.log(error)
// throw new Error('Could not reset password. Please try again later.')
//  }
// }

export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/forgot`, { email });
    return response.status;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Could not reset password. Please try again later.";
    console.error('[ERROR]:', errorMessage);
    toast.error(errorMessage)
  }
}