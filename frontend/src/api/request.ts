const addAppJsonHeader = (options?: RequestInit) => {
  return {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };
};

export class APIError extends Error {
  data: Record<string, unknown>;
  constructor(message: string, data: Record<string, unknown>) {
    super(message);
    this.name = "APIError";
    this.data = data;
  }
}

const request = (
  url: string,
  method: RequestInit["method"],
  options?: RequestInit,
) => {
  return fetch(url, {
    method,
    credentials: "include",
    ...options,
  })
    .then(function (response) {
      // if we plan to support something else except json this needs to be updated
      return response.json().then(function (data) {
        if (response.status !== 200) {
          console.error(
            "Looks like there was a problem. Status Code: " + response.status,
          );
          throw new APIError(`Error happened: ${response.status} status`, data);
        }
        return data;
      });
    })
    .catch(function (err) {
      console.error("Fetch Error :-S", err);
      throw err;
    });
};

export const get = (url: string, options?: RequestInit) =>
  request(url, "GET", options);

export const post = (url: string, options?: RequestInit) =>
  request(url, "POST", addAppJsonHeader(options));

export const patch = (url: string, options?: RequestInit) =>
  request(url, "PATCH", addAppJsonHeader(options));
