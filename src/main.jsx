import React from 'react'
import ReactDOM from 'react-dom/client'
import Navigation from './Navigation.jsx';
import Arcade from './Arcade.jsx'
import Portfolio from './Portfolio.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('navigation')).render(<Navigation />)
ReactDOM.createRoot(document.getElementById('arcade')).render(<Arcade />)
ReactDOM.createRoot(document.getElementById('portfolio')).render(<Portfolio />)