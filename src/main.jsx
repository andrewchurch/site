import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './routes/Home.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="*" element={<Home />} />
        </Routes>
    </BrowserRouter>
);