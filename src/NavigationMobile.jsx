import { useState, useEffect } from 'react';

function FunButton({onClick}) {
    return (
        <li className="text-center">
            <a href="#fun" onClick={onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
                <span className="block text-xs">fun</span>
            </a>
        </li>
    )
}

function WorkButton({onClick}) {
    return (
        <li className="text-center">
            <a href="#work" onClick={onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span className="block text-xs">work</span>   
            </a>
        </li>
    )
}

export default function NavigationMobile() {
    const [activePanel, setActivePanel] = useState(2);

    const overflowContainer = document.getElementById('panelOverflow');
    const colophonPanel = document.getElementById('colophon');

    function changePanel(panel) {
        event.preventDefault();

        // temporarily set the active panel to 0 (nothing) so that nav dissapears during CSS transition
        setActivePanel(panel);

        // logic to actually switch panel
        if (panel === 1) {
            overflowContainer.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });
        } else {
            colophonPanel.scrollIntoView({
                block: 'start',
                behavior: 'smooth',
              });
        }

        // wait to change the active panel until the CSS transition finishes
        setTimeout(() => {
            setActivePanel(panel);
        }, '50');
    }

    useEffect(() => {
        overflowContainer.scrollTop = 99999;
    }, []);

    return (
        <ul className="flex text-indigo-600">
            {activePanel == 2 && 
                <FunButton onClick={() => changePanel(1)} />
            }
            {activePanel == 1 && 
                <WorkButton onClick={() => changePanel(2)} />
            }
        </ul>
    )
}