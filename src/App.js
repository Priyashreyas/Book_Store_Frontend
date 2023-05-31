import {createBrowserRouter, Outlet, RouterProvider,} from "react-router-dom";
import './App.scss'
import Home from "./pages/Home/Home";
import Category from "./pages/Category/Category";
import Book from "./pages/Book/Book";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import About from "./pages/About/About";
import EditBook from "./pages/Book/EditBook";
import DeleteBooks from "./pages/Book/DeleteBooks";
import Users from "./pages/Users/Users";
import EditUser from "./pages/Users/EditUser";
import NewBook from "./pages/Book/NewBook";
import BookData from './BookData.json';

const Layout = () => {
  return (
    <div className="app">
      <Navbar data={BookData}/>
      <div className="outlet">
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/about",
        element: <About/>
      },
      {
        path: "/book/new",
        element: <NewBook/>
      },
      {
        path: "/book/:id",
        element: <Book/>
      },
      {
        path: "/book/:id/edit",
        element: <EditBook/>
      },
      {
        path: "/cart",
        element: <Cart/>
      },
      {
        path: "/category/:id",
        element: <Category/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path: "/delete",
        element: <DeleteBooks/>
      },
      {
        path: "/users",
        element: <Users/>
      },
      {
        path: "/user/:id/edit",
        element: <EditUser/>
      },
      //   TODO: Create a global error page.
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
