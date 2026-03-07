import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const DOG_NAMES = [
  'Biscuit', 'Mochi', 'Waffle', 'Nugget', 'Peanut',
  'Dumpling', 'Pretzel', 'Cinnamon', 'Truffle', 'Pudding',
  'Maple', 'Bean', 'Noodle', 'Pickles', 'Tofu',
  'Butterscotch', 'Cocoa', 'Ginger', 'Pepper', 'Clementine',
];

const getNameForWindow = () => {
  const cycle = Math.floor(Date.now() / (3 * 60 * 1000));
  const index = cycle % DOG_NAMES.length;
  return DOG_NAMES[index];
};

const msUntilNextName = () => {
  const interval = 3 * 60 * 1000;
  return interval - (Date.now() % interval);
};

const Dog = () => {
  const [name, setName] = useState(getNameForWindow);

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

  return (
    <Wrapper>
      <div className="scene">
        <div className="dog">
          <div className="ear ear-left" />
          <div className="ear ear-right" />
          <div className="head">
            <div className="eye eye-left"><div className="pupil" /></div>
            <div className="eye eye-right"><div className="pupil" /></div>
            <div className="snout">
              <div className="nose" />
              <div className="mouth" />
            </div>
            <div className="tongue" />
          </div>
          <div className="body">
            <div className="leg leg-front-left" />
            <div className="leg leg-front-right" />
            <div className="leg leg-back-left" />
            <div className="leg leg-back-right" />
            <div className="tail" />
          </div>
        </div>
        <div className="shadow" />
      </div>
      <h1 className="dog-name">{name}</h1>
      <p className="subtitle">your pup of the moment</p>
    </Wrapper>
  );
};

const wag = keyframes`
  0%, 100% { transform: rotate(-30deg); }
  50% { transform: rotate(30deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;

const blink = keyframes`
  0%, 94%, 100% { transform: scaleY(1); }
  97% { transform: scaleY(0.05); }
`;

const pant = keyframes`
  0%, 100% { height: 8px; }
  50% { height: 14px; }
`;

const shadowPulse = keyframes`
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.15; }
  50% { transform: translateX(-50%) scale(0.85); opacity: 0.1; }
`;

const nameFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  user-select: none;

  .scene {
    position: relative;
    width: 180px;
    height: 220px;
  }

  .dog {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    animation: ${bounce} 1.2s ease-in-out infinite;
  }

  .head {
    position: relative;
    width: 90px;
    height: 80px;
    background: #c4894d;
    border-radius: 45px 45px 35px 35px;
    margin: 0 auto;
    z-index: 2;
  }

  .ear {
    position: absolute;
    width: 30px;
    height: 45px;
    background: #a06830;
    border-radius: 50% 50% 40% 40%;
    top: -8px;
    z-index: 1;
  }

  .ear-left {
    left: 4px;
    transform: rotate(-15deg);
  }

  .ear-right {
    right: 4px;
    transform: rotate(15deg);
  }

  .eye {
    position: absolute;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    top: 22px;
    animation: ${blink} 4s ease-in-out infinite;
  }

  .eye-left { left: 18px; }
  .eye-right { right: 18px; }

  .pupil {
    width: 10px;
    height: 10px;
    background: #2d1810;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 5px;

    &::after {
      content: '';
      position: absolute;
      width: 3px;
      height: 3px;
      background: white;
      border-radius: 50%;
      top: 1px;
      right: 1px;
    }
  }

  .snout {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 24px;
    background: #dba66a;
    border-radius: 50%;
  }

  .nose {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 10px;
    background: #2d1810;
    border-radius: 50% 50% 40% 40%;
  }

  .mouth {
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 4px;
    border-bottom: 2px solid #8b5e3c;
    border-radius: 0 0 50% 50%;
  }

  .tongue {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 8px;
    background: #e87a7a;
    border-radius: 0 0 50% 50%;
    z-index: 3;
    animation: ${pant} 0.6s ease-in-out infinite;
  }

  .body {
    position: relative;
    width: 70px;
    height: 55px;
    background: #c4894d;
    border-radius: 30px 30px 20px 20px;
    margin: -8px auto 0;
  }

  .leg {
    position: absolute;
    width: 16px;
    height: 28px;
    background: #b07840;
    border-radius: 8px 8px 6px 6px;
    bottom: -22px;
  }

  .leg-front-left { left: 6px; }
  .leg-front-right { left: 22px; }
  .leg-back-left { right: 22px; }
  .leg-back-right { right: 6px; }

  .tail {
    position: absolute;
    right: -8px;
    top: 2px;
    width: 8px;
    height: 30px;
    background: #a06830;
    border-radius: 4px 4px 2px 2px;
    transform-origin: bottom center;
    animation: ${wag} 0.4s ease-in-out infinite;
  }

  .shadow {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 12px;
    background: var(--theme-text);
    border-radius: 50%;
    opacity: 0.15;
    animation: ${shadowPulse} 1.2s ease-in-out infinite;
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
`;

export default Dog;
