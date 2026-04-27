import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/AuthReducer";
import { loaderActions } from "../store/LoaderReducer";

const useAPI = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let LOCAL_URL = "https://localhost:8443/Sphinx/api";

  const navigateToLogin = (errorMessage = "") => {
    // failureToast(
    //   errorMessage || "Please Sign In to Your Account to Proceed Further!",
    // );
    dispatch(loaderActions.loaderOff());
    dispatch(authActions.logout());
    navigate("/login");
  };

  async function apiPost(endpoint, data) {
    // console.log("Request Data => ", data);

    try {
      const response = await fetch(LOCAL_URL + endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // // console.log("RESPONSE STATUS => ", response.status);
      if (response.status === 401) {
        navigateToLogin();
        return;
      }

      const result = await response.json();

      return result;
    } catch (err) {
      return err;
    }
  }

  async function apiGet(endpoint) {
    try {
      const response = await fetch(LOCAL_URL + endpoint, {
        method: "GET",
        credentials: "include",
      });

      // // console.log("RESPONSE STATUS => ", response.status);
      if (response.status === 401) {
        navigateToLogin();
      }

      const result = await response.json();

      return result;
    } catch (err) {
      console.error("Error while fetching data =>", err);
      return { data: null };
    }
  }
  async function apiGetFile(endpoint) {
  try {
    const response = await fetch(LOCAL_URL + endpoint, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      navigateToLogin();
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }

    const blob = await response.blob();

    return {
      blob,
      filename: getFileNameFromHeader(response)
    };

  } catch (err) {
    console.error("Error downloading file =>", err);
    return null;
  }
}

  async function apiDelete(endpoint, data) {
    // console.log("DELETE Request Data => ", data);

    try {
      const response = await fetch(LOCAL_URL + endpoint, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        navigateToLogin();
      }

      const result = await response.json();
      return result;
    } catch (err) {
      return err;
    }
  }

  async function apiPut(endpoint, data) {
    // console.log("PUT Request Data => ", data);

    try {
      const response = await fetch(LOCAL_URL + endpoint, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // // console.log("RESPONSE STATUS => ", response.status);
      if (response.status === 401) {
        navigateToLogin();
      }

      const result = await response.json();
      return result;
    } catch (err) {
      return err;
    }
  }

  async function apiFileGet(endpoint) {
    try {
      const response = await fetch(LOCAL_URL + endpoint, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        navigateToLogin();
      }

      const result = await response.blob();

      return result;
    } catch (err) {
      return err;
    }
  }

  async function apiFilePost(endpoint, formData) {
    // console.log("Request Data => ", formData);

    try {
      const response = await fetch(LOCAL_URL + endpoint, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.status === 401) {
        navigateToLogin();
      }

      const result = await response.json();
      return result;
    } catch (err) {
      return err;
    }
  }

  const isError = (responseObject) => {
    if (!responseObject) return true;

    if (
      responseObject.responseMessage &&
      responseObject.responseMessage === "success"
    )
      return false;

    return true;
  };

  return {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    apiFileGet,
    apiFilePost,
    isError,
  };
};

export default useAPI;
