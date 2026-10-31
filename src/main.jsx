import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

// The family's admin panel lives at /admin and is only downloaded there.
const AdminRoot = lazy(() => import('./admin/AdminRoot.jsx'))
const isAdminPage = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminPage ? (
      <Suspense fallback={null}>
        <AdminRoot />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
