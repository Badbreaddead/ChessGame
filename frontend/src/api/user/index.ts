import { get } from "../request";

export const identifyUser = () => {
  return get("http://localhost:8080/user");
};
