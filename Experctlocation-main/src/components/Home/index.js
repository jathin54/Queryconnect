import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import "./index.css"
const Home = () => {
  return (
    <div className='HomeContainer'>
     <Header/>
     <main className="home">
   
      <div className="content">
        <h1>Query-connect</h1>
        <p>The Social Platform for knowledge Sharing</p>
      </div>
     
    </main>
     <Footer/>
    </div>
    
  );
};

export default Home;
