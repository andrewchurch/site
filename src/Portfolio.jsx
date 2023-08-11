import { useState, useEffect } from 'react';
import { getAllProjects } from './data/portfolio.mjs'

function PortfolioListItem(props) {
    const { project } = props;

    return (
        <div className="my-16 first:my-8">
            {project.images && project.images.map((image,i) => 
                <img key={i} className="w-full aspect-video object-cover object-top shadow" src={image.src} alt={image.alt} />
            )}
            <div className="px-8">
                <h3 className="mt-4 text-2xl font-semibold text-slate-800 tracking-tight leading-tight">{project.name}</h3>
                <ul className="mt-1 flex space-x-2 text-xs text-indigo-600">
                    {project.links.map((link,i) => 
                        <li key={i}>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    )}
                </ul>
                <div className="mt-2 text-base text-slate-700">
                    {project.summary}
                </div>
                <div className="mt-4 flex gap-x-5">
                    <div className="border-t-2 pt-4 w-1/2 flex gap-x-3">
                        <h4 className="font-bold text-sm text-slate-800">Tech</h4>
                        <ul className="space-y-2 mt-0.5 text-xs text-slate-500">
                            {project.tech.map((tech,i) => 
                                <li key={i}>
                                    {tech}
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="border-t-2 pt-4 w-1/2 flex gap-x-3">
                        <h4 className="font-bold text-sm text-slate-800">Role(s)</h4>
                        <ul className="space-y-2 mt-0.5 text-xs text-slate-500">
                            {project.roles.map((role,i) => 
                                <li key={i}>
                                    {role}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>  
    )
}

export default function Portfolio() {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllProjects();
        setProjects([...res]);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="w-full mx-auto max-w-xl">
            <div className="px-8 pt-12">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Selected Projects
                </h2>
                { loading && 
                    <p className="mt-2 text-base text-slate-700">loading...</p>
                }
            </div>
            <div>
                { projects.length > 0 && projects.map(project => (
                    <PortfolioListItem key={project.id} project={project} />
                )) }
            </div>
        </div>
    )
}