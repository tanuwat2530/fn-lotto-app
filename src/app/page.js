import React from 'react';
import Head from 'next/head';
import '../styles/page.css';  // Import the CSS file
import MainMenu from "../components/main-menu-component";



export default function Home() {
  
  return (
    
    <div className="flex flex-col h-screen">
      

      {/* Top Section */}
      {/* <header>
        <button>
          หน้าหลัก
        </button>
        <button>
          ฝาก - ถอน
        </button>
      </header> */}

      {/* Middle Section */}
      <main>
     
      <MainMenu/>
        {/* <div name='box-list' className="box-list">
         <div>
          <center><h4><b>LOTTO THAI</b></h4></center>
          <Playlist />
         
          <br/>
          <center><h4><b>LOTTO LAO</b></h4></center>
          <Playlist />
          </div> 
        </div> */}
      </main>

      {/* Bottom Section */}
      <footer>
        <div name='home-bottom' className="home-button-footer">
          หวย
        </div>
        <div name='home-bottom' className="home-button-footer">
          คาสิโน
        </div>
        <div name='home-bottom' className="home-button-footer">
          คริปโต
        </div>
        <div name='home-bottom' className="home-button-footer">
          บอล
        </div>
       
      </footer>
    </div>
  );
}
