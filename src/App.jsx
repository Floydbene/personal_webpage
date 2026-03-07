import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HomeLayout,
  Landing,
  Error,
  Resume,
  SinglePageError,
  Login,
  TodoList,
} from "./pages";
import Dog from "./pages/Dog";
import CachingRS from "./pages/CachingRS";
import CryptoRS from "./pages/CryptoRS";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
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
      {
        path: "login",
        element: <Login />,
        errorElement: <SinglePageError />,
      },
      {
        path: "dog",
        element: <Dog />,
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <TodoList />,
      },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
export default App;
