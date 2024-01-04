import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/00-login.js"
import Dashboard from "./pages/01-CreateUser.js"
import Initiate from "./pages/02-Initiate.js"
import Submissions from "./pages/03-Submissions.js"
import PageNotFound from "./pages/99-notFound.js";
import './App.css';
import { useSelector } from 'react-redux'


import ConditionalRoute from './routes/conditionalRoute.js';
import './App.css'
import Navbar from "./components/nav/navbar.js";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </div>
  );
}

function Layout() {
  const { isLoggedIn } = useSelector(state => state.user)

  return (
    <>
    {isLoggedIn && <Navbar />}
        <ConditionalRoute />
    </>
  );
}

export default App;

