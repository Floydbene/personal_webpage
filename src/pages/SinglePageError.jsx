import { Link, useRouteError } from 'react-router-dom';

const SinglePageError = () => {
  const error = useRouteError();
  const notFound = error?.status === 404;
  return (
    <main className='error-content error-content--inline'>
      <p className='error-code'>{notFound ? '404 / Not found' : 'Page unavailable'}</p>
      <h1>{notFound ? 'Off the index.' : 'A loose connection.'}</h1>
      <p>{notFound ? 'This entry isn’t available. There’s more to explore in the index.' : 'This page couldn’t load. Try again, or explore the index.'}</p>
      <div className='error-actions'>
        <Link to='/'>Back to the index <span aria-hidden='true'>↗</span></Link>
        {!notFound && <button type='button' onClick={() => window.location.reload()}>Try again</button>}
      </div>
    </main>
  );
};

export default SinglePageError;
