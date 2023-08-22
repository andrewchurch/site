import React from 'react';
import ReactDOM from 'react-dom/client';
import Navigation from './Navigation.jsx';
import NavigationMobile from './NavigationMobile.jsx';
import Arcade from './Arcade.jsx';
import Portfolio from './Portfolio.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('arcade')).render(<Arcade />);
ReactDOM.createRoot(document.getElementById('portfolio')).render(<Portfolio />);
ReactDOM.createRoot(document.getElementById('navigationMobile')).render(<NavigationMobile />);
ReactDOM.createRoot(document.getElementById('navigation')).render(<Navigation />);