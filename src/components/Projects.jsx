import { useFetchProjects } from './fetchProjects';

const Projects = () => {
  const { loading, projects } = useFetchProjects();
  if (loading) {
    return (
      <section className='projetcs'>
        <h1
          style={{
            margin: '5rem auto',
            textAlign: 'center',
            color: 'var(--primary-500)',
          }}
        >
          Loading...
        </h1>
      </section>
    );
  }
  return (
    <section className='projects fade-in-quick'>
      <div className='title'>
        <h1
          className='title'
          style={{
            textTransform: 'initial',
            fontWeight: '200',
            marginBottom: '3rem',
          }}
        >
          Past projects
        </h1>
        <h5 className='project-syn'>
          These are a select few websites that I have worked on and have the
          ability to publish. Most of these were done for practice and to
          showcase specific usability functions. Feel free to give them a look!
        </h5>
        <div className='title-underline'></div>
      </div>
      <div className='projects-center'>
        {projects.map((project) => {
          const { id, img, url, title } = project;
          return (
            <a
              key={id}
              href={url}
              target='_blank'
              rel='noreferrer'
              className='project'
            >
              <img src={img} alt={title} className='img' />
              <h5>{title}</h5>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
