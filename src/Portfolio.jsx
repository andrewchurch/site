const projects = [{
    name: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit',
    photos: [{
        src: 'https://place-hold.it/500x300',
        alt: 'alt text',
    }],
    roles: [
        'Role 1',
        'Role 2',
    ],
    tech: [
        'Tech 1',
        'Tech 2',
    ],
    links: [{
        label: 'Project Website',
        href: 'www.google.com',
    }, {
        label: 'Additional Link',
        href: 'foobar.com',
    }],
    summary: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam eligendi quos hic laboriosam voluptatum non, maiores quam incidunt sequi, porro autem quia facilis tenetur repellendus! Excepturi reiciendis autem iure ab.',
}, {
    name: 'Project Two',
    photos: [{
        src: 'https://place-hold.it/500x300',
        alt: 'alt text',
    }],
    roles: [
        'Role 3',
        'Role 4',
    ],
    tech: [
        'Tech 1',
        'Tech 2',
    ],
    links: [{
        label: 'Link 1',
        href: 'www.google.com',
    }, {
        label: 'Link 3',
        href: 'foobar.com',
    }],
    summary: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam eligendi quos hic laboriosam voluptatum non, maiores quam incidunt sequi, porro autem quia facilis tenetur repellendus! Excepturi reiciendis autem iure ab.',
}];

function ProjectList() {

    const projectItems = projects.map((project,i) =>
      <div key={i} className="my-16 first:my-8 max-w-xl">
        {project.photos.map((photo,i) => 
            <img key={i} className="w-full aspect-video" src={photo.src} alt={photo.alt} />
        )}
        <h3 className="mt-4 text-2xl font-semibold text-slate-800 tracking-tight">{project.name}</h3>
        <ul className="flex space-x-2 text-xs text-indigo-600">
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
    );

    return (
        <div>
            {projectItems}
        </div>
    )
}

function Portfolio() {
    return (
        <div className="p-8 w-full">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Selected Projects
            </h2>
            <ProjectList />
        </div>
    )
}

export default Portfolio