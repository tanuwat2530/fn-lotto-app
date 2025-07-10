"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import ThaiLotto from "../../components/thai-lotto-component"

import '../../styles/thai-lotto-page.css';  // Import the CSS file

export default function ThaiLottoPage() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <ThaiLotto/>
         
      </main>

     
      </div>
  );
}
