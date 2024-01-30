import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Landing = () => {
  const copyEmail = () => {
    toast.success('Copied email to clipboard', {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    navigator.clipboard.writeText('floyd.benedikter@gmail.com');
  };
  return (
    <>
      <div className='svg-frame'>
        <svg
          id='text'
          width='100%'
          height='20vw'
          viewBox='0 0 1169 115'
          strokeLinecap='round'
          fillRule='evenodd'
          fontSize='9pt'
          stroke='#C6878F'
          strokeWidth='1mm'
          preserveAspectRatio='xMinYMin meet'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          {/* <g
            id='svgGroup'
            strokeLinecap='round'
            fillRule='evenodd'
            fontSize='9pt'
            stroke='#C6878F'
            strokeWidth='1mm'
            preserveAspectRatio='xMinYMin meet'
            fill='none'
            // style={{ stroke: '#000', strokeWidth: '1mm', fill: 'none' }}
          > */}
          <path
            d='M 0 6.5 L 32.25 5.25 L 32.25 78.5 L 99.25 78.5 L 99.25 6.5 L 131.5 6.5 L 131.5 176.5 L 99.25 176.5 L 99.25 104.5 L 32.25 104.5 L 32.25 176.5 L 0 176.5 L 0 6.5 Z'
            stroke='#C6878F'
            strokeWidth='2'
            strokeLinecap='square'
          />
          <path
            d='M 279.25 115.5 L 279.25 125.5 L 197.5 125.5 A 34.022 34.022 0 0 0 201.375 136.281 A 29.945 29.945 0 0 0 208.5 144.625 Q 216.972 151.524 230.601 151.743 A 55.964 55.964 0 0 0 231.5 151.75 A 55.232 55.232 0 0 0 239.576 151.185 A 42.654 42.654 0 0 0 246.375 149.625 A 104.389 104.389 0 0 0 251.643 147.768 Q 254.542 146.663 257.765 145.272 A 203.657 203.657 0 0 0 261.75 143.5 L 271.25 167 A 50.945 50.945 0 0 1 258.872 173.892 A 65.426 65.426 0 0 1 250.625 176.5 A 138.288 138.288 0 0 1 243.474 178.082 Q 236.316 179.454 231.096 179.499 A 40.805 40.805 0 0 1 230.75 179.5 A 92.819 92.819 0 0 1 210.255 177.368 Q 192.878 173.436 181.125 162.25 A 57.307 57.307 0 0 1 163.93 128.537 A 81.351 81.351 0 0 1 163 116 A 83.289 83.289 0 0 1 165.303 95.867 A 58.524 58.524 0 0 1 179.375 69.5 A 54.086 54.086 0 0 1 210.42 53.128 A 78.274 78.274 0 0 1 224 52 A 67.805 67.805 0 0 1 240.335 53.843 A 42.785 42.785 0 0 1 265.875 70.875 A 72.584 72.584 0 0 1 278.78 106.085 A 92.281 92.281 0 0 1 279.25 115.5 Z M 197.75 103.75 L 248.5 103.75 A 48.589 48.589 0 0 0 246.429 96.397 Q 243.867 89.572 239.5 85.625 Q 233 79.75 223.25 79.75 A 26.913 26.913 0 0 0 214.722 81.051 A 22.82 22.82 0 0 0 206.5 85.875 Q 200.328 91.475 198.128 101.778 A 47.988 47.988 0 0 0 197.75 103.75 Z'
            stroke='#C6878F'
            strokeWidth='2'
            strokeLinecap='square'
          />
          <path
            d='M 306 2.75 L 338.25 0 L 338.25 176.5 L 306 176.5 L 306 2.75 Z'
            stroke='#C6878F'
            strokeWidth='2'
            strokeLinecap='square'
          />
          <path
            d='M 372.5 2.75 L 404.75 0 L 404.75 176.5 L 372.5 176.5 L 372.5 2.75 Z'
            stroke='#C6878F'
            strokeWidth='2'
            strokeLinecap='square'
          />
          <path
            d='M 474.596 177.353 A 76.457 76.457 0 0 0 493.25 179.5 A 87.396 87.396 0 0 0 509.803 178.003 A 61.093 61.093 0 0 0 540.75 162.625 A 54.622 54.622 0 0 0 556.271 136.604 A 75.311 75.311 0 0 0 558.75 116.75 A 86.374 86.374 0 0 0 557.361 100.914 A 60.885 60.885 0 0 0 542.125 69.875 A 54.087 54.087 0 0 0 514.437 54.112 A 82.048 82.048 0 0 0 495.25 52 Q 466 52 449.125 69.25 A 56.986 56.986 0 0 0 434.574 95.595 A 80.682 80.682 0 0 0 432.25 115.5 Q 432.25 144.75 448.375 162.125 A 52.283 52.283 0 0 0 474.596 177.353 Z M 521.184 95.49 A 31.345 31.345 0 0 0 517.625 89.625 A 24.817 24.817 0 0 0 499.818 79.946 A 36.157 36.157 0 0 0 496 79.75 Q 481.75 79.75 473.75 88.5 A 27.073 27.073 0 0 0 468.286 97.914 Q 465.75 105.116 465.75 115.25 A 75.689 75.689 0 0 0 466.356 125.166 Q 467.029 130.243 468.448 134.369 A 29.749 29.749 0 0 0 472.625 142.5 Q 479.5 151.75 493.75 151.75 A 38.147 38.147 0 0 0 504.073 150.42 A 29 29 0 0 0 516.5 143.375 A 25.273 25.273 0 0 0 522.633 133.758 Q 524.146 129.695 524.784 124.645 A 63.072 63.072 0 0 0 525.25 116.75 Q 525.25 104.154 521.184 95.49 Z'
            stroke='#C6878F'
            strokeWidth='2'
            strokeLinecap='square'
          />
          {/* </g> */}
        </svg>
        {/* <h2 className='subtitle fade-in'>My name is Floyd.</h2> */}
        <h4 className='info fade-in'>My name is Floyd.</h4>
        <h4 className='info fade-in'>
          I am a computer science graduate from Princeton University.
        </h4>
        <h4 className='info fade-in'>
          I thrive where code, creativity, and collaboration converge.
        </h4>
        <h4 className='info fade-in'>
          I find joy in transforming complex problems into elegant web
          solutions.
        </h4>
        <h4 className='info fade-in'>
          I love to work with a team to build together the future.
        </h4>
        <button className='btn contact' onClick={() => copyEmail()}>
          <h1 className='btnText'>reach out</h1>
        </button>
      </div>
    </>
  );
};
export default Landing;
