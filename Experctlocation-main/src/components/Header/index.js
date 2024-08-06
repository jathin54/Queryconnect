import React from 'react'
import "./index.css"

const Header = () => {
  return (
    <header>
      <div className="logo">Your Logo</div>
      <nav>
        <a href='registration'>
        <button>Register</button>
        </a>
        <a href='login'>
          <button>Login</button>
        </a>
        
      </nav>
    </header>
  );
};

export default Header;
