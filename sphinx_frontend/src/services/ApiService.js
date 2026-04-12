let LOCAL_URL = "https://localhost:8443/Sphinx/api";

export async function apiPost(endpoint, data) {
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

    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}

export async function apiGet(endpoint) {
  try {
    const response = await fetch(LOCAL_URL + endpoint, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    return result;
  } catch (err) {
    console.error("Error while fetching data =>", err);
    return { data: null };
  }
}

export async function apiDelete(endpoint, data) {
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

    const result = await response.json();
    return result;
  } catch (err) {
    return err;
  }
}

export async function apiPut(endpoint, data) {
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

    const result = await response.json();
    return result;
  } catch (err) {
    return err;
  }
}

export async function apiFileGet(endpoint) {
  try {
    const response = await fetch(LOCAL_URL + endpoint, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.blob();

    return result;
  } catch (err) {
    return err;
  }
}

export async function apiFilePost(endpoint, formData) {
  // console.log("Request Data => ", formData);

  try {
    const response = await fetch(LOCAL_URL + endpoint, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (err) {
    return err;
  }
}

export const isError = (responseObject) => {
  if (!responseObject) return true;

  if (
    responseObject.responseMessage &&
    responseObject.responseMessage === "success"
  )
    return false;

  return true;
};
