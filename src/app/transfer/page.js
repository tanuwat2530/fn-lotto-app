"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import Transfer from "../../components/transfer-component"

//import '../../styles/thai-lotto-page.css';  // Import the CSS file

export default function ThaiLottoPage() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <Transfer/>
         
      </main>

     
      </div>
  );
}
