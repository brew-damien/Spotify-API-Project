import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import AlbumsPage from "./pages/AlbumsPage";
import RootLayout from "./pages/Root";
import ProductDetailPage from "./pages/ProductDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: `/`, element: <HomePage /> },
      { path: "/albums", element: <AlbumsPage /> },
      { path: "/albums/:productId", element: <ProductDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
