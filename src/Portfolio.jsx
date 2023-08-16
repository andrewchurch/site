import { useState, useEffect, useRef } from 'react';
import { getAllProjects } from './services/data.mjs'
import { loginUser } from './services/auth.mjs';

function PortfolioListItem(props) {
    const { project } = props;

    return (
        <div className="mt-16 first:mt-8">
            {project.images && project.images.map((image,i) => 
                <img key={i} className="w-full aspect-video object-cover object-top shadow" src={image.src} alt={image.alt} />
            )}
            <div className="px-8">
                <h3 className="mt-4 text-2xl font-semibold text-slate-800 tracking-tight leading-tight">{project.name}</h3>
                {project.links &&
                    <ul className="text-xs text-indigo-600">
                        {project.links.map((link,i) => 
                            <li key={i} className="mt-1">
                                <a href={link.href} className="after:content-['_↗'] transition-colors hover:text-indigo-400">{link.label}</a>
                            </li>
                        )}
                    </ul>
                }
                {project.summary &&
                    <div className="mt-2 text-base text-slate-700">
                        {project.summary}
                    </div>
                }
                {(project.tech || project.roles) &&
                    <div className="mt-4 flex gap-x-5">
                        {project.tech &&
                            <div className="border-t-2 pt-4 w-1/2 flex gap-x-3">
                                <h4 className="font-bold text-sm text-slate-800">Tech</h4>
                                <ul className="space-y-2 mt-0.5 text-xs text-slate-500">
                                    {project.tech.sort().map((tech,i) => 
                                        <li key={i}>
                                            {tech}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }
                        {project.roles && 
                            <div className="border-t-2 pt-4 w-1/2 flex gap-x-3">
                                <h4 className="font-bold text-sm text-slate-800">Role(s)</h4>
                                <ul className="space-y-2 mt-0.5 text-xs text-slate-500">
                                    {project.roles.sort().map((role,i) => 
                                        <li key={i}>
                                            {role}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>  
    )
}

function PortfolioList() {

    const [isLoading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllProjects();
        setProjects([...res]);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="px-8 pt-16">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selected Projects</h2>
                { isLoading && 
                    <p className="mt-2 text-base text-slate-700">loading...</p>
                }
            </div>
            <div className="pb-16">
                { projects.length > 0 && projects.map(project => (
                    <PortfolioListItem key={project.id} project={project} />
                )) }
            </div>        
        </>
    )
}

function PortfolioAuthentication({onLogin}) {
    const passwordRef = useRef(null);
    const [error, setError] = useState(false);

    function onSuccess(response) {
        onLogin();
        //console.log(`Success! Response: ${JSON.stringify({ response })}`);
    }

    function onFailure(error) {
        setError('Nope. Try again or contact me.')
        //console.log(`Failed :( ${JSON.stringify(error)}`);
    }

    function handleSubmit(e) {
        e.preventDefault();

        loginUser(
            'andrewchurch@gmail.com',
            passwordRef.current.value,
            onSuccess,
            onFailure,
        );
    }

    return (
        <div className="flex md:h-screen">
            <div className="px-8 py-16 m-auto">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selected Projects</h2>
                {error ? 
                    <p className="text-base text-red-700">{error}</p>
                    : 
                    <p className="text-base text-slate-700">Enter password to view some work.</p>
                }
                <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
                    <input type="password" onFocus={() => setError(false)} required placeholder="Password here" ref={passwordRef} className="rounded-md border-0 px-3 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 leading-6 placeholder:text-gray-400" />
                    <button type="submit" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default function Portfolio() {
    const [isLoggedIn, setLoggedIn] = useState(false);

    return (
        <div className="w-full mx-auto max-w-xl">
            { isLoggedIn ? 
                <PortfolioList />
                :
                <PortfolioAuthentication onLogin={() => setLoggedIn(true)} />
            }
        </div>
    )
}