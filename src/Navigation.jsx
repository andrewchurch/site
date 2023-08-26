import { useState, useEffect } from 'react';

function FunButton({onClick}) {
    return (
        <li>
            <a href="#fun" onClick={onClick}>
                <svg className="inline w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>&nbsp;<span className="text-xs">fun</span>
            </a>
        </li>
    )
}

function WorkButton({onClick}) {
    return (
        <li className="ml-auto">
            <a href="#work" onClick={onClick}>
                <span className="text-xs">work</span>&nbsp;<svg className="inline w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>      
            </a>
        </li>
    )
}

export default function Navigation() {
    const [activePanel, setActivePanel] = useState(0);

    const panelContainer = document.getElementById('panelContainer');
    const panelClass = 'md:-translate-x-1/3';
    const overflowContainer = document.getElementById('panelOverflow');
    const overflowClass = 'md:overflow-hidden';

    function changePanel(panel) {
        event.preventDefault();

        // temporarily set the active panel to 0 (nothing) so that nav dissapears during CSS transition
        setActivePanel(0);

        if (panel === 1) {
            overflowContainer.classList.add(overflowClass);
            panelContainer.classList.remove(panelClass);
        } else {
            overflowContainer.classList.remove(overflowClass);
            panelContainer.classList.add(panelClass);
        }

        // wait to change the active panel until the CSS transition finishes
        setTimeout(() => {
            setActivePanel(panel);
        }, '100');
    }

    useEffect(() => {

        // on load set panel to 2 and add transition 
        changePanel(1);
        setTimeout(() => {
            panelContainer.classList.add('md:transition-transform');
        }, '100');
    }, []);

    return (
        <ul className="flex transition-colors text-indigo-600 hover:text-indigo-400">
            {activePanel == 2 && 
                <FunButton onClick={() => changePanel(1)} />
            }
            {activePanel == 1 && 
                <WorkButton onClick={() => changePanel(2)} />
            }
        </ul>
    )
}