const projects = [{
    name: 'Project One',
    photos: [{
        src: 'https://place-hold.it/500x300',
        alt: 'alt text',
    }, {
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
        label: 'Link 1',
        href: 'www.google.com',
    }, {
        label: 'Link 2',
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
        label: 'Link 2',
        href: 'foobar.com',
    }],
    summary: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam eligendi quos hic laboriosam voluptatum non, maiores quam incidunt sequi, porro autem quia facilis tenetur repellendus! Excepturi reiciendis autem iure ab.',
}];

function ProjectList() {

    const projectItems = projects.map((project,i) =>
      <div key={i}>
        {project.photos.map((photo,i) => 
            <img key={i} src={photo.src} alt={photo.alt} />
        )}
        <h3>{project.name}</h3>
        <ul>
            {project.roles.map((role,i) => 
                <li key={i}>
                    {role}
                </li>
            )}
        </ul>
        <ul>
            {project.tech.map((tech,i) => 
                <li key={i}>
                    {tech}
                </li>
            )}
        </ul>
        <ul>
            {project.links.map((link,i) => 
                <li key={i}>
                    <a href={link.href}>{link.label}</a>
                </li>
            )}
        </ul>
        <div>
            {project.summary}
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
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                Portfolio
            </h2>
            <ProjectList />
        </div>
    )
}

export default Portfolio