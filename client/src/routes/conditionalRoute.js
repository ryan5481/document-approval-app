import { Navigate, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../App.css';

import Login from '../pages/00-login.js';
import Dashboard from '../pages/01-CreateUser.js';
import Initiate from '../pages/02-Initiate.js';
import Submissions from '../pages/03-Submissions.js';
import PageNotFound from '../pages/99-notFound.js';
import SignupUserForm from '../components/forms/signupUserForm.js';
import MainThread from '../components/comment/MainThread.js';
import Inspect from '../pages/04-inspect.js';



const ConditionalRoute = () => {
  const { userRole } = useSelector(state => state.user)
  if (userRole === 'superAdmin') {
    return <SuperAdminRoutes />
  } else if (userRole === 'admin') {
    return <AdminRoutes />
  } else if (userRole === 'initiator') {
    return <InitiatorRoutes />
  } else if(userRole === 'user') {
    return <UserRoutes />
  } else {
    return <NonUserRoutes />
  }
}

const SuperAdminRoutes = () => {
  return (
    <>
      <Routes >
        {/* <Route path="/" element={<Submissions />} /> */}
        <Route path="/create-user" element={<SignupUserForm />} />
        <Route path="/Initiate" element={<Initiate />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/inspect/:id" element={<Inspect />} />
        
      </Routes>
    </>
  )
}

const AdminRoutes = () => {
  return (
    <>
      <Routes >
        {/* <Route path="/" element={<Submissions />} /> */}
        <Route path="/initiate" element={<Initiate />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/inspect/:id" element={<Inspect />} />

        <Route path="/comment" element={<Inspect />} />
      </Routes>
    </>
  )
}

const InitiatorRoutes = () => {
  return (
    <>
      <Routes>
      <Route path="/" element={<Submissions />} />
      <Route path="/initiate" element={<Initiate />} />
      <Route path="/submissions" element={<Submissions />} />

      <Route path="/thread" element={<MainThread />} />
      </Routes>
    </>
  )
}

const UserRoutes = () => {
  return (
    <>
      <Routes>
      <Route path="/" element={<Submissions />} />
      <Route path="/inspect/:id" element={<Inspect />} />

      <Route path="/thread" element={<MainThread />} />
      </Routes>
    </>
  )
}

const NonUserRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/" element={<Login />} />

        <Route path="/thread" element={<MainThread />} />
      </Routes>
    </>
  )
}

export default ConditionalRoute





