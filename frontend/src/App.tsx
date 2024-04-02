import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import { AppLogic } from "./AppLogic";
import { Root } from "./pages";
import { GameWithAI } from "./pages/GameWithAI";
import { LocalGame } from "./pages/LocalGame";
import { OnlineGame } from "./pages/OnlineGame";
import { routes } from "./routes";

const router = createBrowserRouter([
  {
    path: "",
    element: <AppLogic />,
    children: [
      {
        index: true,
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
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
