import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const DOG_NAMES = [
  'Biscuit', 'Mochi', 'Waffle', 'Nugget', 'Peanut',
  'Dumpling', 'Pretzel', 'Cinnamon', 'Truffle', 'Pudding',
  'Maple', 'Bean', 'Noodle', 'Pickles', 'Tofu',
  'Butterscotch', 'Cocoa', 'Ginger', 'Pepper', 'Clementine',
];

const getNameForWindow = () => {
  const cycle = Math.floor(Date.now() / (3 * 60 * 1000));
  return DOG_NAMES[cycle % DOG_NAMES.length];
};

const msUntilNextName = () => {
  const interval = 3 * 60 * 1000;
  return interval - (Date.now() % interval);
};

const Dog = () => {
  const { user } = useAuth();
  const [name, setName] = useState(getNameForWindow);

  const { data: access, isLoading: accessLoading } = useQuery({
    queryKey: ['dog-access'],
    queryFn: async () => {
      const { data } = await api.get('/api/dog/access');
      return data;
    },
    enabled: !!user,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    const schedule = () => {
      const ms = msUntilNextName();
      return setTimeout(() => {
        setName(getNameForWindow());
        timerRef = schedule();
      }, ms);
    };
    let timerRef = schedule();
    return () => clearTimeout(timerRef);
  }, []);

  if (!user) {
    return (
      <Wrapper>
        <div className="access-message">
          <p>Sign in to see if it's your turn for the pup!</p>
        </div>
      </Wrapper>
    );
  }

  if (accessLoading) {
    return (
      <Wrapper>
        <div className="access-message">
          <p>Checking pup access...</p>
        </div>
      </Wrapper>
    );
  }

  if (access && !access.hasAccess) {
    const windowEnd = new Date(access.windowEnd);
    const minutesLeft = Math.max(0, Math.ceil((windowEnd - Date.now()) / 60000));
    return (
      <Wrapper>
        <div className="access-message">
          <h2>Not your turn!</h2>
          <p>
            The pup is currently with{' '}
            <strong>{access.currentHolder?.split('@')[0]}</strong>
          </p>
          <p className="rotation-info">
            Next rotation in {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}
          </p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="husky">
        <div className="mane">
          <div className="coat" />
        </div>
        <div className="body">
          <div className="head">
            <div className="ear" />
            <div className="ear" />
            <div className="face">
              <div className="eye" />
              <div className="eye" />
              <div className="nose" />
              <div className="mouth">
                <div className="lips" />
                <div className="tongue" />
              </div>
            </div>
          </div>
          <div className="torso" />
        </div>
        <div className="legs">
          <div className="front-legs">
            <div className="leg" />
            <div className="leg" />
          </div>
          <div className="hind-leg" />
        </div>
        <div className="tail">
          <div className="tail">
            <div className="tail">
              <div className="tail">
                <div className="tail">
                  <div className="tail">
                    <div className="tail" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="squiggly-0">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="0" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="squiggly-1">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="1" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
          <filter id="squiggly-2">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="squiggly-3">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="3" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
          <filter id="squiggly-4">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="4" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>
      </svg>
      <h1 className="dog-name">{name}</h1>
      <p className="subtitle">your pup of the moment</p>
    </Wrapper>
  );
};

/* ---- Keyframes ---- */

const kfHead = keyframes`
  0%, 6.66667% { transform: rotate(0); }
  20% { transform: rotate(-14deg); }
  40% { transform: rotate(-7deg); }
  46.66667% { transform: rotate(-14deg); }
  60% { transform: rotate(-7deg); }
  73.33333%, 80% { transform: rotate(0); }
`;

const kfMouth = keyframes`
  0%, 6.66667% { transform: translateX(0); }
  13.33333%, 20%, 26.66667% { transform: translateX(35%); }
  33.33333% { transform: translateX(0) translateY(-5%); }
`;

const kfNose = keyframes`
  0%, 6.66667% { transform: translate(0); }
  13.33333%, 26.66667% { transform: translateX(100%); }
  33.33333% { transform: translateX(0) translateY(-15%); }
`;

const kfBody = keyframes`
  0% { transform: translate(0); }
  6.66667% { transform: translateY(3%); }
  13.33333%, 20% { transform: translate(0); }
  26.66667% { transform: translateY(2%); }
  33.33333% { transform: translateY(0); }
`;

const kfMane = keyframes`
  0% { transform: translate(0); }
  6.66667% { transform: translateY(5%); }
  13.33333%, 20% { transform: translate(0); }
  26.66667% { transform: translateY(3%); }
  33.33333% { transform: translateY(0); }
`;

const kfFace = keyframes`
  0%, 6.66667% { transform: translate(0); }
  13.33333% { transform: translateX(15%); }
  20%, 26.66667% { transform: translateX(15%) translateY(0); }
  33.33333%, 40% { transform: translateX(0) translateY(-15%); }
  46.66667% { transform: translateX(0) translateY(0); }
`;

const kfLeftEye = keyframes`
  2.66667% { transform: scaleY(1); }
  3.33333% { transform: scaleY(0.3); }
  4% { transform: scaleY(1); }
  6.66667% { transform: translateX(0); }
  9.33333% { transform: scaleY(1) translateX(75%); }
  10% { transform: scaleY(0.3) translateX(75%); }
  10.66667% { transform: scaleY(1) translateX(75%); }
  13.33333% { transform: translateX(150%); }
  22% { transform: scaleY(1) translateX(150%); }
  22.66667% { transform: scaleY(0.3) translateX(150%); }
  23.33333% { transform: scaleY(1) translateX(150%); }
  25.33333% { transform: scaleY(1) translateX(150%); }
  26% { transform: scaleY(0.3) translateX(150%); }
  26.66667% { transform: scaleY(1) translateX(150%); }
  33.33333% { transform: translateX(0) translateY(-170%); }
  36% { transform: scaleY(1) translateY(-170%); }
  36.66667% { transform: scaleY(0.3) translateY(-170%); }
  37.33333% { transform: scaleY(1) translateY(-170%); }
  38% { transform: scaleY(1) translateY(-170%); }
  38.66667% { transform: scaleY(0.3) translateY(-170%); }
  39.33333% { transform: scaleY(1) translateY(-170%); }
  53.33333% { transform: translateY(0); }
  65.33333% { transform: scaleY(1) translateY(0); }
  66% { transform: scaleY(0.3) translateY(0); }
  66.66667% { transform: scaleY(1) translateY(0); }
  70% { transform: scaleY(1) translateY(0); }
  70.66667% { transform: scaleY(0.3) translateY(0); }
  71.33333% { transform: scaleY(1) translateY(0); }
`;

const kfRightEye = kfLeftEye;

const kfTongue = keyframes`
  46.66667% { transform: translateY(0); }
  53.33333%, 73.33333% { transform: translateY(100%) rotate(10deg); }
  80% { transform: translateY(0); }
`;

const kfMouthCoverLeft = keyframes`
  40% { transform: rotate(0); }
  60%, 73.33333% { transform: rotate(90deg); }
  86.66667% { transform: rotate(0); }
`;

const kfMouthCoverRight = keyframes`
  40% { transform: rotate(0); }
  60%, 73.33333% { transform: rotate(-90deg); }
  86.66667% { transform: rotate(0); }
`;

const kfTail = keyframes`
  6.66667% { transform: rotate(0); }
  10% { transform: rotate(30deg); }
  13.33333%, 20% { transform: rotate(0); }
  26.66667%, 46.66667% { transform: rotate(30deg); }
  48.33333% { transform: rotate(0); }
  50% { transform: rotate(28deg); }
  50.83333% { transform: rotate(0); }
  51.66667% { transform: rotate(28deg); }
  52.5% { transform: rotate(0); }
  53.33333% { transform: rotate(28deg); }
  54.16667% { transform: rotate(0); }
  55% { transform: rotate(28deg); }
  55.83333% { transform: rotate(0); }
  56.66667% { transform: rotate(28deg); }
  57.5% { transform: rotate(0); }
  58.33333% { transform: rotate(28deg); }
  59.16667% { transform: rotate(0); }
  60% { transform: rotate(28deg); }
  60.83333% { transform: rotate(0); }
  61.66667% { transform: rotate(28deg); }
  62.5% { transform: rotate(0); }
  63.33333% { transform: rotate(28deg); }
  64.16667% { transform: rotate(0); }
  65% { transform: rotate(28deg); }
  65.83333% { transform: rotate(0); }
  66.66667% { transform: rotate(28deg); }
  67.5% { transform: rotate(0); }
  68.33333% { transform: rotate(28deg); }
  69.16667% { transform: rotate(0); }
  70% { transform: rotate(28deg); }
  70.83333% { transform: rotate(0); }
  71.66667% { transform: rotate(28deg); }
  72.5% { transform: rotate(0); }
`;

const kfLeftEar = keyframes`
  0%, 6.66667% { transform: rotate(6deg); }
  13.33333%, 26.66667% { transform: rotate(15deg); }
  33.33333%, 40% { transform: rotate(30deg); }
  46.66667%, 53.33333% { transform: rotate(0deg); }
  60%, 80% { transform: rotate(15deg); }
  93.33333%, 100% { transform: rotate(6deg); }
`;

const kfRightEar = keyframes`
  0%, 6.66667% { transform: rotateZ(-16deg) rotateY(180deg); }
  13.33333%, 26.66667% { transform: rotateZ(-19deg) rotateY(180deg); }
  33.33333% { transform: rotateZ(-30deg) rotateY(180deg); }
  36.66667% { transform: rotateZ(-19deg) rotateY(180deg); }
  37.33333% { transform: rotateZ(-30deg) rotateY(180deg); }
  38%, 40% { transform: rotateZ(-19deg) rotateY(180deg); }
  40.66667% { transform: rotateZ(-30deg) rotateY(180deg); }
  41.33333% { transform: rotateZ(-19deg) rotateY(180deg); }
  46.66667%, 53.33333% { transform: rotateZ(-9deg) rotateY(180deg); }
  60% { transform: rotateZ(-19deg) rotateY(180deg); }
  60.66667% { transform: rotateZ(-30deg) rotateY(180deg); }
  61.33333%, 62.66667% { transform: rotateZ(-19deg) rotateY(180deg); }
  63.33333% { transform: rotateZ(-30deg) rotateY(180deg); }
  64%, 80% { transform: rotateZ(-19deg) rotateY(180deg); }
  93.33333%, 100% { transform: rotateZ(-16deg) rotateY(180deg); }
`;

const kfSquiggly = keyframes`
  0% { filter: url("#squiggly-0"); }
  25% { filter: url("#squiggly-1"); }
  50% { filter: url("#squiggly-2"); }
  75% { filter: url("#squiggly-3"); }
  100% { filter: url("#squiggly-4"); }
`;

const nameFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const TIMING = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
const DUR = '12s';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  user-select: none;

  .access-message {
    text-align: center;
    color: var(--theme-text);
    h2 { font-size: 1.5rem; margin-bottom: 0.75rem; }
    p { color: var(--theme-textMuted); font-size: 1rem; margin: 0.25rem 0; }
    .rotation-info { margin-top: 1rem; font-size: 0.85rem; opacity: 0.7; }
  }

  .dog-name {
    margin-top: 1.5rem;
    font-size: 2rem;
    color: var(--theme-text);
    font-weight: 300;
    letter-spacing: 3px;
    animation: ${nameFloat} 3s ease-in-out infinite;
  }

  .subtitle {
    color: var(--theme-textMuted);
    font-size: 0.85rem;
    margin-top: 0.25rem;
    letter-spacing: 1px;
  }

  /* ======== HUSKY ======== */

  .husky, .husky *, .husky *::before, .husky *::after {
    animation-timing-function: ${TIMING} !important;
    box-sizing: border-box;
    position: relative;
  }

  .husky div::before, .husky div::after {
    content: '';
    display: block;
    position: absolute;
  }

  .husky {
    animation: ${kfSquiggly} 0.3s infinite;
    height: 45vmin;
    width: 63vmin;
    max-width: 380px;
    max-height: 270px;
  }

  .husky::before {
    content: '';
    display: block;
    position: absolute;
    width: 90%;
    height: 0.5vmin;
    background: #30508F;
    border-radius: 0.5vmin;
    top: 100%;
    left: 5%;
    z-index: 2;
  }

  .husky::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 10%;
    top: calc(100% + 0.5vmin);
    z-index: 3;
    background: var(--theme-accent, #4F8EDB);
  }

  .head {
    animation: ${kfHead} ${DUR} none infinite;
    position: absolute;
    height: 45%;
    width: 58%;
    left: 34%;
    top: 5%;
    transform-origin: bottom center;
  }
  .head::before {
    background: #30508F;
    border-top-left-radius: 50% 40%;
    border-top-right-radius: 50% 40%;
    border-bottom-right-radius: 10% 60%;
    height: 100%;
    width: 100%;
  }

  .face {
    animation: ${kfFace} ${DUR} none infinite;
    position: absolute;
    width: 98%;
    height: 62%;
    top: 15%;
    left: 2%;
  }
  .face::before {
    z-index: 1;
    width: 94%;
    height: 70%;
    left: 3%;
    background-color: white;
    bottom: 5%;
    border-top-left-radius: 40% 50%;
    border-top-right-radius: 40% 50%;
    border-bottom-left-radius: 30% 50%;
    border-bottom-right-radius: 30% 40%;
  }

  .eye {
    position: absolute;
    width: 30%;
    height: 40%;
    background-color: white;
    right: 45%;
    border-top-left-radius: 55% 50%;
    border-top-right-radius: 45% 50%;
    z-index: 2;
  }
  .eye::before {
    animation: ${kfLeftEye} ${DUR} none infinite;
    height: 15%;
    width: 15%;
    border-radius: 100%;
    background: #343C60;
    top: 45%;
    left: 45%;
    transform-origin: center center;
  }
  .eye + .eye {
    z-index: 1;
    right: initial;
    left: 48%;
    border-top-right-radius: 55% 50%;
    border-top-left-radius: 45% 50%;
  }

  .nose {
    animation: ${kfNose} ${DUR} none infinite;
    z-index: 2;
    position: absolute;
    width: 20%;
    height: 20%;
    top: 29%;
    left: 42%;
  }
  .nose::after {
    background: #30508F;
    height: 100%;
    width: 100%;
    border-top-left-radius: 20% 20%;
    border-top-right-radius: 30% 20%;
    border-bottom-right-radius: 55% 80%;
    border-bottom-left-radius: 50% 80%;
  }
  .nose::before {
    height: 100%;
    width: 200%;
    background: white;
    top: 50%;
    left: -50%;
    z-index: -1;
    border-radius: 50%;
  }

  .ear {
    animation: ${kfLeftEar} ${DUR} both infinite;
    position: absolute;
    top: 3%;
    left: -10%;
    width: 48%;
    height: 30%;
    border-bottom-left-radius: 100% 90%;
    border-top-left-radius: 10%;
    transform-origin: 80% center;
    overflow: hidden;
    background: #30508F;
  }
  .ear::before {
    width: 70%;
    height: 55%;
    border: 2px solid #30508F;
    background: #DE6465;
    top: 20%;
    left: 15%;
    transform-origin: top left;
    transform: skewX(30deg) rotate(-5deg);
  }
  .ear::after {
    width: 70%;
    height: 100%;
    border-top-left-radius: 100%;
    background: #30508F;
    left: 32%;
    transform-origin: top left;
    transform: rotate(-5deg);
  }
  .ear + .ear {
    animation: ${kfRightEar} ${DUR} both infinite;
    background-color: #343C60;
    left: 15%;
    top: 5%;
    z-index: -1;
    transform-origin: right center;
  }
  .ear + .ear::before { border-color: #343C60; }
  .ear + .ear::after { background: #343C60; }

  .mouth {
    z-index: 1;
    animation: ${kfMouth} ${DUR} none infinite;
    position: absolute;
    width: 48%;
    height: 55%;
    bottom: -5%;
    left: 28%;
    overflow: hidden;
  }
  .mouth::before, .mouth::after {
    animation: ${kfMouthCoverLeft} ${DUR} none infinite;
    width: 28%;
    height: 100%;
    background: white;
    top: -50%;
    left: 0;
    z-index: 3;
    transform-origin: right top;
  }
  .mouth::after {
    animation: ${kfMouthCoverRight} ${DUR} none infinite;
    left: initial;
    right: 0;
    transform-origin: left top;
  }

  .lips {
    z-index: 2;
    height: 35%;
    width: 100%;
  }
  .lips::before, .lips::after {
    background: white;
    width: calc(50% + 1.5px);
    border-color: #9EB6D7;
    border-width: 3px;
    border-style: solid;
    height: 100%;
    border-bottom-left-radius: 65% 100%;
    border-bottom-right-radius: 35% 50%;
    border-top-right-radius: 50%;
    border-right-color: transparent;
    border-top-color: transparent;
  }
  .lips::after {
    transform: rotateY(180deg);
    left: initial;
    right: 0;
  }

  .tongue {
    animation: ${kfTongue} ${DUR} none infinite;
    position: absolute;
    height: 100%;
    width: 44%;
    background: #DE6465;
    left: 25%;
    bottom: 100%;
    z-index: 1;
    border-bottom-left-radius: 50% 20%;
    border-bottom-right-radius: 50% 20%;
  }

  .body {
    animation: ${kfBody} ${DUR} none infinite;
    width: 45%;
    height: 100%;
    position: absolute;
    left: 25%;
  }

  .torso {
    position: absolute;
    height: 55%;
    width: 100%;
    bottom: 0;
  }
  .torso::before {
    background: #30508F;
    height: 100%;
    width: 50%;
    transform: translateX(-20%) skewX(-30deg);
    transform-origin: left bottom;
    border-radius: 0 30% 0 60%;
  }
  .torso::after {
    background: #30508F;
    height: 100%;
    width: 60%;
    top: 0;
    right: 0;
    border-radius: 10% 40% 60% 0;
  }

  .mane {
    animation: ${kfMane} ${DUR} none infinite;
    z-index: 2;
    position: absolute;
    width: 31.5%;
    height: 30%;
    top: 44%;
    left: 37%;
  }
  .mane::before {
    background: white;
    height: 40%;
    width: 100%;
    border-top-left-radius: 10% 50%;
    border-top-right-radius: 20% 100%;
    border-bottom-left-radius: 10% 50%;
  }
  .mane::after {
    background: white;
    top: 25%;
    height: 76%;
    width: 30%;
    right: 23%;
    border-top-right-radius: 100% 80%;
    transform: rotate(47deg);
    transform-origin: bottom right;
  }

  .coat {
    position: absolute;
    width: 50%;
    height: 50%;
    background: white;
    transform-origin: bottom right;
    left: 10%;
    top: 21%;
    transform: rotate(25deg) skewX(-30deg);
  }

  .legs {
    background-color: #30508F;
    position: absolute;
    height: 30%;
    width: 42%;
    left: 23%;
    bottom: 0;
    border-top-left-radius: 20% 37%;
    border-bottom-left-radius: 10% 37%;
    border-top-right-radius: 50%;
    z-index: 1;
  }

  .front-legs {
    position: absolute;
    width: 55%;
    height: 117%;
    bottom: 0;
    right: -12%;
  }
  .front-legs::before {
    width: 4%;
    height: 6%;
    background: transparent;
    bottom: 0;
    left: 47%;
    box-shadow: -1.3vmin 0 0 #9EB6D7, -2.8vmin 0 0 #9EB6D7, 1.3vmin 0 0 #4F8EDB, 2.8vmin 0 0 #4F8EDB;
    z-index: 2;
  }
  .front-legs > .leg {
    width: 51%;
    height: 100%;
    position: absolute;
    bottom: 0;
    right: 50%;
    overflow: hidden;
  }
  .front-legs > .leg::before {
    background: #C8DAF2;
    height: 100%;
    width: 100%;
    transform: skewY(-30deg) skewX(10deg);
    transform-origin: top right;
  }
  .front-legs > .leg + .leg {
    right: 0;
    transform: rotateY(180deg);
  }
  .front-legs > .leg + .leg::before {
    background: #9EB6D7;
  }

  .hind-leg {
    position: absolute;
    background: #9EB6D7;
    width: 35%;
    height: 25%;
    border-top-left-radius: 35% 100%;
    border-top-right-radius: 40% 100%;
    bottom: 0;
    right: 45%;
  }
  .hind-leg::before {
    width: 6%;
    height: 20%;
    background: transparent;
    bottom: 0;
    left: 70%;
    box-shadow: -0.8vmin 0 0 #4F8EDB, 0.8vmin 0 0 #4F8EDB;
  }

  .husky > .tail {
    position: absolute;
    width: 15%;
    height: 6%;
    bottom: 0;
    right: 72%;
    background: #343C60;
    z-index: 0;
    border-top-left-radius: 10% 50%;
    border-bottom-left-radius: 10% 50%;
  }
  .husky > .tail > .tail {
    right: 88%;
  }
  .tail > .tail {
    animation: ${kfTail} ${DUR} none infinite;
    height: 100%;
    width: 4vmin;
    right: 26%;
    transform-origin: center right;
    border-top-left-radius: 50% 50%;
    border-bottom-left-radius: 50% 50%;
    transform: rotate(0deg);
    background: #343C60;
  }

  @media screen and (max-width: 400px) {
    .husky {
      animation: none;
    }
  }
`;

export default Dog;
