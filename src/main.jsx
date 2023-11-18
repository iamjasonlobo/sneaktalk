import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import Layout from './routes/Layout.jsx';
import App from './App.jsx'
import CreateView from './routes/CreateView.jsx';
import CrewmateView from './routes/CrewmateView.jsx';
import DetailView from './routes/DetailView.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index={true} element={<App />} />
      <Route index={false} path="/create" element={<CreateView />} />
      <Route index={false} path="/:uuid/edit" element={<CrewmateView />} />
      <Route index={false} path="/:uuid" element={<DetailView />} />
    </Route>
  </Routes>
</BrowserRouter>
)
