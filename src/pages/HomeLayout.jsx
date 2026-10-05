import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Terminal from '../shell/Terminal';

const HomeLayout = () => {
  const navigation = useNavigation();
  const { pathname, search } = useLocation();
  const previousPath = useRef(pathname);
  const contentRef = useRef(null);
  const isPageLoading = navigation.state === 'loading';

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const query = new URLSearchParams(search);
    // The index handles positioning and focus for its own deep links.
    if (pathname === '/' && (query.has('entry') || query.has('section'))) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    contentRef.current?.focus({ preventScroll: true });
  }, [pathname, search]);

  return (
    <>
      <a className='skip-link' href='#main-content'>Skip to content</a>
      <Navbar />
      <section className='page' id='main-content' ref={contentRef} tabIndex={-1} aria-busy={isPageLoading}>
        {isPageLoading ? (
          <div className='loading' role='status'><span className='sr-only'>Loading page…</span></div>
        ) : <Outlet />}
      </section>
      {/* Keep the shell mounted across routes to preserve cwd and scrollback. */}
      <Terminal />
    </>
  );
};
export default HomeLayout;
