import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    background: var(--theme-cardBackground);
    border: 1px solid var(--theme-border);
    border-radius: var(--borderRadius);
    padding: 2.5rem;
    width: 90vw;
    max-width: 400px;

    h3 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: var(--theme-text);
    }
  }

  .form-row {
    margin-bottom: 1rem;

    label {
      display: block;
      font-size: var(--small-text);
      margin-bottom: 0.5rem;
      color: var(--theme-textSecondary);
      letter-spacing: 1px;
    }

    input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: var(--borderRadius);
      border: 1px solid var(--theme-border);
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 1rem;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: var(--theme-accent);
      }
    }
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.5rem;
    border: none;
    border-radius: var(--borderRadius);
    background: var(--theme-accent);
    color: var(--theme-background);
    font-size: 1rem;
    cursor: pointer;
    letter-spacing: 1px;
    transition: var(--transition);

    &:hover {
      opacity: 0.85;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export default Wrapper;
