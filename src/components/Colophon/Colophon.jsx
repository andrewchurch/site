import { forwardRef } from 'react';
import Navigation from '../Navigation/Navigation.jsx';

const Colophon = forwardRef(function Colophon(props, colophonRef) {

    return (
        <div ref={colophonRef} tabIndex="0" className="bg-white relative snap-start md:snap-align-none">
            <div className="flex h-full md:sticky md:h-screen md:top-0">
                <Navigation changePanel={props.changePanel} activePanel={props.activePanel} />
                <div className="m-auto px-8 py-16">
                    <img className="rounded-full w-20 h-20 ring-2 ring-indigo-400" src="/src/assets/images/headshot_square_optimized.webp" alt="Headshot of Andrew" width="80" height="80" />
                    <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight">
                        Andrew Church
                    </h1>
                    <p className="text-base text-slate-700">
                        Full Stack Developer. Development Manager. Web Problem Solver.
                    </p>
                    <ul className="flex items-center space-x-2 mt-2 text-xs text-indigo-600">
                        <li>
                            <a href="https://www.linkedin.com/in/andrewthewebguy/" className="after:content-['_↗'] transition-colors hover:text-indigo-400">
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/andrewchurch" className="after:content-['_↗'] transition-colors hover:text-indigo-400">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="mailto:andrewchurch@gmail.com" className="transition-colors hover:text-indigo-400">
                                andrewchurch@gmail.com                           
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

export default Colophon;

