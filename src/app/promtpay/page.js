"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import Promtpay from "../../components/promtpay-component"

//import '../../styles/thai-lotto-page.css';  // Import the CSS file

export default function ThaiLotPromtpayPage() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <Promtpay/>
         
      </main>

     
      </div>
  );
}
