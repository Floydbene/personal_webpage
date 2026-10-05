import { Link, useRouteError } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  const notFound = error?.status === 404;
  return (
    <main className='error-page'>
      <Link className='error-home' to='/'>floyd.benedikter</Link>
      <div className='error-content'>
        <p className='error-code'>{notFound ? '404 / Not found' : 'Page unavailable'}</p>
        <h1>{notFound ? 'Off the index.' : 'A loose connection.'}</h1>
        <p>{notFound ? 'This page may have moved, or the link may be incomplete.' : 'This page couldn’t load. Try again, or explore the index.'}</p>
        <div className='error-actions'>
          <Link to='/'>Back to the index <span aria-hidden='true'>↗</span></Link>
          {notFound ? <Link to='/resume'>View résumé</Link> : <button type='button' onClick={() => window.location.reload()}>Try again</button>}
        </div>
      </div>
    </main>
  );
};

export default Error;
