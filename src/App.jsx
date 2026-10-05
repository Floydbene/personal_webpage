import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  Error,
  Resume,
  Posts,
  Post,
  SinglePageError,
} from "./pages";
import CachingRS from "./pages/CachingRS";
import CryptoRS from "./pages/CryptoRS";
import { ThemeProvider } from "./context/ThemeContext";
import { ShellProvider } from "./context/ShellContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellProvider><HomeLayout /></ShellProvider>,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <SinglePageError />,
      },
      {
        path: "resume",
        element: <Resume />,
        errorElement: <SinglePageError />,
      },
      {
        path: "posts",
        errorElement: <SinglePageError />,
        children: [
          {
            index: true,
            element: <Posts />,
            errorElement: <SinglePageError />,
          },
          {
            path: ":slug",
            element: <Post />,
            errorElement: <SinglePageError />,
          },
        ],
      },
      {
        path: "research",
        errorElement: <SinglePageError />,
        children: [
          {
            path: "caching",
            element: <CachingRS />,
            errorElement: <SinglePageError />,
          },
          {
            path: "crypto",
            element: <CryptoRS />,
            errorElement: <SinglePageError />,
          },
        ],
      },
    ],
  },
]);

const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);

export default App;
