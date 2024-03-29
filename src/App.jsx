import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HomeLayout, Landing, Error, Resume, SinglePageError } from './pages';
import CachingRS from './pages/CachingRS';
import CryptoRS from './pages/CryptoRS';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <SinglePageError />,
      },
      {
        path: 'resume',
        element: <Resume />,
        errorElement: <SinglePageError />,
      },
      {
        path: 'research',
        errorElement: <SinglePageError />,
        children: [
          {
            path: 'caching',
            element: <CachingRS />,
            errorElement: <SinglePageError />,
          },
          {
            path: 'crypto',
            element: <CryptoRS />,
            errorElement: <SinglePageError />,
          },
        ]
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default App;
