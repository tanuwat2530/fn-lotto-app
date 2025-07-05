"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import InputLotto from "../../components/thai-lotto-component"
import MyLottoOrder from "../../components/my-lotto-order-component"
import '../../styles/thai-lotto-page.css';  // Import the CSS file

export default function ThaiLotto() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <InputLotto sendData={0}/>
          {/* <MyLottoOrder/> */}
      </main>

      {/* <div className="th-page-footer">
      <button className='thal-lotto-button-footer'  onClick={() => router.push("/")}>
          หน้าหลัก
        </button>
        <button className='thal-lotto-button-footer'>
          ตรวจรางวัล
        </button>
        <button className='thal-lotto-button-footer'>
          ฝาก - ถอน
        </button>
      </div> */}
      </div>
  );
}
