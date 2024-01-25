import { Navigate, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../App.css';

import Login from '../pages/00-login.js';
import Initiate from '../pages/03-Initiate.js';
import Submissions from '../pages/05-Submissions.js';
// import PageNotFound from '../pages/99-notFound.js';
import CreateUsers from '../pages/01-CreateUsers.js';
import Inspect from '../pages/04-inspect.js';
import Status from '../components/status/status.js';
import InspectCase from '../components/status/inspectCase.js';
import Users from '../pages/02-Users.js';



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
        <Route path="/create-user" element={<CreateUsers />} />
        <Route path="/users" element={<Users />} />
        <Route path="/Initiate" element={<Initiate />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/inspect/:id" element={<Inspect />} />
        <Route path="/inspect-case/:id" element={<InspectCase />} />
        
      <Route path="/status" element={<Status />} />

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
        <Route path="/inspect-case/:id" element={<InspectCase />} />


        <Route path="/status" element={<Status />} />


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
      <Route path="/inspect/:id" element={<Inspect />} />
      <Route path="/submissions" element={<Submissions />} />

      <Route path="/status" element={<Status />} />

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
      <Route path="/inspect-case/:id" element={<InspectCase />} />
      <Route path="/submissions" element={<Submissions />} />


      <Route path="/status" element={<Status />} />

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


      </Routes>
    </>
  )
}

export default ConditionalRoute





