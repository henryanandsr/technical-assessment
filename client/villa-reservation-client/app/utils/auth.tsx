import axios from "axios";

const SERVER_URL = process.env.SERVER_URL;

export async function handleLogin(email: string, password: string) : Promise<any>{
  try {
    const response = await axios.post(`${SERVER_URL}/api/login`, {
      email,
      password,
    },
    {
      withCredentials: true,
    }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unable to login");
    }
  } catch (err) {
    console.error(err);
  }
}
export async function handleLogout() : Promise<any>{
  try {
    const response = await axios.post(`${SERVER_URL}/api/logout`, {},
    {
      withCredentials: true,
    }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unable to logout");
    }
  } catch (err) {
    console.error(err);
  }
}
