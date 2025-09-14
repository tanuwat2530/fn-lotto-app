"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import AddCredit from "../../components/add-credit-component"

import '../../styles/add-credit-component.css';  // Import the CSS file

export default function ThaiLottoPage() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <AddCredit/>
         
      </main>

     
      </div>
  );
}
