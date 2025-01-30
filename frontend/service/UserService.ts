import {
  setStorageItemAsync,
  getStorageItemAsync,
} from "@/app/useStorageState";

const login = (email: string, password: string) => {
  return fetch(encodeURI(process.env.EXPO_PUBLIC_API_URL + "/auth/login"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

const register = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return fetch(encodeURI(process.env.EXPO_PUBLIC_API_URL + `/auth/register`), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, password, email }),
  });
};

const refreshToken = async (accessToken: string) => {
  const refreshToken = await getStorageItemAsync("refreshToken");
  return fetch(encodeURI(process.env.EXPO_PUBLIC_API_URL + `/auth/refresh`), {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
      accessToken: "Bearer " + accessToken,
    }),
  });
};

const callApiWithRefreshToken = async (
  signOut: () => void,
  apiCall: (token: string, ...data: any) => Promise<Response>,
  ...data: any
) => {
  // Retrieve the access token from storage
  const accessToken = await getStorageItemAsync("accessToken");

  // Make the initial API call with the access token
  let response = await apiCall(accessToken?.toString() as string, ...data);

  // If the response status is 401 (Unauthorized)
  if (response.status === 401) {
    if (accessToken) {
      // Attempt to refresh the token
      const refreshResponse = await refreshToken(accessToken);
      const refreshData = await refreshResponse.json();

      // If the refresh was successful
      if (refreshResponse.status === 200) {
        // Update storage with new tokens
        setStorageItemAsync("accessToken", refreshData.accessToken);
        setStorageItemAsync("refreshToken", refreshData.refreshToken);

        // Retry the initial API call with the new access token
        response = await apiCall(refreshData.accessToken, ...data);
      } else if (refreshResponse.status === 401) {
        // If the refresh failed, clear storage and redirect to home page
        setStorageItemAsync("accessToken", null);
        setStorageItemAsync("refreshToken", null);
        setStorageItemAsync("session", null);
        signOut();
      }
    } else {
      // If the refresh failed, clear storage and redirect to home page
      setStorageItemAsync("accessToken", null);
      setStorageItemAsync("refreshToken", null);
      setStorageItemAsync("session", null);
      signOut();
    }
  }

  // Return the response from the API call
  return response;
};

const changePassword = (
  token: string,
  oldPassword: string,
  newPassword: string
) => {
  return fetch(
    encodeURI(process.env.EXPO_PUBLIC_API_URL + `/auth/changePassword`),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    }
  );
};

const logOutAllDevices = (token: string) => {
  return fetch(
    encodeURI(process.env.EXPO_PUBLIC_API_URL + `/auth/logoutAllDevices`),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

const UserService = {
  login,
  register,
  callApiWithRefreshToken,
  changePassword,
  logOutAllDevices,
};

export default UserService;
