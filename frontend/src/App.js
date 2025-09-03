import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute'
import OnlymeRoute from './components/OnlymeRoute'
import UserForm from './pages/admin/UserForm';
import TeamAdminList from './pages/admin/TeamPositionManage';
import DocumentEdit from './pages/documents/EditPage';
import Dashboard from './pages/Dashboard';
import DocumentList from './pages/documents/DocumentList'
import DocumentDetail from './pages/documents/DocumentDetail';
import ApproveList from './pages/documents/ApprovalList';
import SignatureRegister from './pages/signature/SignatureRegister'
import { ChatProvider } from "./components/ChatProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><ProtectedRoute allowedRoles={'ROLE_ADMIN'}><AdminDashboard /></ProtectedRoute></PrivateRoute>} />
          <Route path="/admin/user/list" element={<PrivateRoute><ProtectedRoute allowedRoles={'ROLE_ADMIN'}><UserList /></ProtectedRoute></PrivateRoute>} />
          <Route path="/admin/user/form" element={<PrivateRoute><ProtectedRoute allowedRoles={'ROLE_ADMIN'}><UserForm /></ProtectedRoute></PrivateRoute>} />
          <Route path="/admin/user/form/:userId" element={<PrivateRoute><ProtectedRoute allowedRoles={'ROLE_ADMIN'}><UserForm /></ProtectedRoute></PrivateRoute>} />
          <Route path="/admin/team/list" element={<PrivateRoute><ProtectedRoute allowedRoles={'ROLE_ADMIN'}><TeamAdminList /></ProtectedRoute></PrivateRoute>} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/document/edit" element={<PrivateRoute><DocumentEdit /></PrivateRoute>} />
          <Route path="/document/edit/:docId" element={<PrivateRoute><OnlymeRoute><DocumentEdit /></OnlymeRoute></PrivateRoute>} />
          <Route path="/document/approve/list" element={<PrivateRoute><ApproveList /></PrivateRoute>} />
          <Route path="/document/list" element={<PrivateRoute><DocumentList /></PrivateRoute>} />
          <Route path="/document/detail/:docId" element={<PrivateRoute><DocumentDetail /></PrivateRoute>} />
          <Route path="/signature/register" element={<PrivateRoute><SignatureRegister /></PrivateRoute>} />
        </Routes>
       </ChatProvider>
      <ToastContainer autoClose={3000} />
    
    </QueryClientProvider>
  );
}

export default App;