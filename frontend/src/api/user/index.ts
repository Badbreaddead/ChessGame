import { BACKEND_ADDRESS_API } from "../config";
import { get, post } from "../request";

export const identifyUser = () => {
  return get(`${BACKEND_ADDRESS_API}/user`);
};

export const setUserName = (name: string) => {
  return post(`${BACKEND_ADDRESS_API}/user/name`, {
    body: JSON.stringify({ name }),
  });
};
