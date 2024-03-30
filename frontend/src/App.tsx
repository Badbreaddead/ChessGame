import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Root } from "./pages";
import { LocalGame } from "./pages/LocalGame";
import { GameWithAI } from "./pages/GameWithAI";
import { OnlineGame } from "./pages/OnlineGame";
import { routes } from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: `${routes.online}/:gameId`,
    element: <OnlineGame />,
  },
  {
    path: `${routes.ai}/:gameId`,
    element: <GameWithAI />,
  },
  {
    path: `${routes.local}/:gameId`,
    element: <LocalGame />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
