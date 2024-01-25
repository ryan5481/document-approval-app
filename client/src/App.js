import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { useSelector } from 'react-redux'


import ConditionalRoute from './routes/conditionalRoute.js';
import './App.css'
import Navbar from "./components/nav/navbar.js";


function App() {

  return (
    <div className="min-h-screen bg-blue-300">
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

