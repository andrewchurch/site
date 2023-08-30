function NavItem({changePanel, props}) {

    const classes = {
        'listItem': [].concat(props.listItemClasses),
        'button': [
            'flex', 'gap-x-1', 'items-center', 'rounded-md', 'bg-indigo-600', 'hover:bg-indigo-400', 'px-3', 'py-1.5', 'text-xs', 'font-semibold', 'leading-6', 'text-white', 'shadow-sm'].concat(props.buttonClasses),
        'arrow': ['inline, w-6, h-6'].concat(props.arrowClasses),
        'text': [].concat(props.textClasses)
    };

    return (
        <li className={classes.listItem.join(' ')}>
            <button className={classes.button.join(' ')} onClick={() => changePanel(props.panel)}>
                <svg className={classes.arrow.join(' ')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span className={classes.text.join(' ')}>{props.text}</span>
            </button>
        </li>
    );
}

export default function Navigation({changePanel, activePanel}) {

    const buttons = [ 
        {
            'panel': 'portfolio',
            'text': 'Work',
            'listItemClasses': 'hidden md:inline-block ml-auto',
            'arrowClasses': 'rotate-180',
            'textClasses': 'order-first'
        }, {
            'panel': 'arcade',
            'text': 'Fun',
            'listItemClasses': 'ml-auto md:ml-0',
            'arrowClasses': 'rotate-90 md:rotate-0'
        }
    ];

    return (
        <nav className="absolute w-full p-8 z-10">
            <ul className="flex text-xs transition-colors text-indigo-600 hover:text-indigo-400">
                { buttons.map( (button, i) => (
                    button.panel !== activePanel && <NavItem key={i} changePanel={changePanel} props={button} />
                )) }
            </ul>
        </nav>
    );
}