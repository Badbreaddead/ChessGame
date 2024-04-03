export const BACKEND_ADDRESS = `${process.env.REACT_APP_BACKEND_PROTOCOL}://${process.env.REACT_APP_BACKEND_DOMAIN}:${process.env.REACT_APP_BACKEND_PORT}`;
export const BACKEND_ADDRESS_API = `${BACKEND_ADDRESS}/api`;
export const WEBSOCKET_ADDRESS = `ws://${process.env.REACT_APP_BACKEND_DOMAIN}:${process.env.REACT_APP_BACKEND_PORT}`;
