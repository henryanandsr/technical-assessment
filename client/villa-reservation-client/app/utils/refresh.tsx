import axios from "axios";

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      console.log("refreshing");
      const response = await axios.get(process.env.SERVER_URL + "/api/refresh", {
        withCredentials: true,
        });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  return refresh;
};

export default useRefreshToken;
