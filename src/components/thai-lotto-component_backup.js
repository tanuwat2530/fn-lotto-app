
import React from "react";
import { useState,useEffect } from "react";
import { Home, User, Settings, Bell ,ChevronFirst ,ChevronLast , ChevronLeft , ChevronRight} from "lucide-react";
import "../styles/thai-lotto-component.css"; // Import CSS file

  
export default function ThaiLottoPage() {

const icons = [
  { name: "3 ตัวบน", icon: Home},
  { name: "3 ตัวล่าง", icon: User },
  { name: "2 ตัวบน", icon: Settings },
  { name: "2 ตัวล่าง", icon: Bell },
];

const rewardRatio = [500,400,300,200,];

// State for each input's read-only status
const [readOnlyInputs, setReadOnlyInputs] = useState([false, false, false]);
 // Function to set read-only for a specific input
const handleButtonClick = (index) => {
  if (index === 0 || index === 1 ) {
    setReadOnlyInputs([false, false, false]);
  } else {
    setReadOnlyInputs([true, false, false]);
  }
};

const [inputValue, setInputValue] = useState("");
useEffect(() => {
  if (readOnlyInputs[0]) {
    setInputValue(""); // Clear input when condition is true
  }
}); // Runs only when the condition changes

const [currentCredit,setCurrentCredit] = useState(100);
const [rewardRatioId, setRewardRatioId] = useState(0);
const [totalReward,setTotalReward] = useState(0);
const [payCredit,setPayCredit] = useState(0);

const increasePayCredit = (pay,num) => {
  var credit;
  credit = pay+num;
  if(credit >= currentCredit)
  {return currentCredit}
  return credit;
};

const decreasePayCredit = (pay,num) => {
  var credit;
  credit = pay-num;
  if(credit <= 0)
  {return 0}
  return credit;
};

const calculateReward = (credit,rate) => {
  if(currentCredit <= 0)
  {return 0}
  if(credit >= currentCredit)
  {return currentCredit*rate}

  return credit*rate;
};


  return (  
    <div> 
    <br/>
        <center>
            <h4>งวดประจำวันที่ 16 กุมภาพันธุ์ 2569</h4>
        </center>
        <div className="input-lotto-digi-grid">
          <input 
            id="digi-1" 
            type="text" 
            className="input-lotto-digi-box"  
            inputMode="numeric" // Mobile keyboard shows numbers
            pattern="[0-9]*" // Ensures only numbers
            maxLength={1} // Prevents more than 1 character
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            readOnly={readOnlyInputs[0]} // Control read-only state 
          />
          <input 
            id="digi-2" 
            type="text" 
            className="input-lotto-digi-box"  
            inputMode="numeric" // Mobile keyboard shows numbers
            pattern="[0-9]*" // Ensures only numbers
            maxLength={1} // Prevents more than 1 character

          />
           <input 
            id="digi-3" 
            type="text" 
            className="input-lotto-digi-box"  
            inputMode="numeric" // Mobile keyboard shows numbers
            pattern="[0-9]*" // Ensures only numbers
            maxLength={1} // Prevents more than 1 character

          />
        </div>  
        <center>
            <h4>เครดิต : {currentCredit}</h4>
            <h4>อัตราการจ่าย : 1 ต่อ {rewardRatio[rewardRatioId]}</h4>
        </center>
        
        <div className="icon-lotto-type-grid">
          {icons.map(({ name, icon: Icon }, index) => (
            <button 
              className="icon-lotto-type-button" 
              onClick={(event) => {
              event.preventDefault(); // Prevents default action
              handleButtonClick(index); // Set specific input as read-only
              setRewardRatioId(index);
              setTotalReward(0);
              setPayCredit(0);
            }} >
              <Icon size={56} className="icon-lotto-type-icon" />
              <span className="icon-lotty-type-text">{name}</span>
            </button>
          ))}
        </div>
        <br/>

        <div className="input-lotto-digi-grid">
        <ChevronFirst size={42} 
         onClick={(event) => {
          event.preventDefault(); // Prevents default action
          if(payCredit  >= 10)
          {
            setPayCredit(decreasePayCredit(payCredit,10))
            setTotalReward(calculateReward(payCredit-10,rewardRatio[rewardRatioId]))
          }
        }} 
        />
        <ChevronLeft size={42}
         onClick={(event) => {
          event.preventDefault(); // Prevents default action
          if(payCredit  >= 1)
            {
          setPayCredit(decreasePayCredit(payCredit,1))
          setTotalReward(calculateReward(payCredit-1,rewardRatio[rewardRatioId]))
            }
        }} /> 
          <input 
          className="input-lotto-digi-box"
          inputMode="numeric" // Mobile keyboard shows numbers
          pattern="[0-9]*" // Ensures only numbers
          value={payCredit}
          /> 
        <ChevronRight size={42}
         onClick={(event) => {
          event.preventDefault(); // Prevents default action
          setPayCredit(increasePayCredit(payCredit,1))
          setTotalReward(calculateReward(payCredit+1,rewardRatio[rewardRatioId]))

        }} /> 
        <ChevronLast size={42}
         onClick={(event) => {
          event.preventDefault(); // Prevents default action
          setPayCredit(increasePayCredit(payCredit,10))
          setTotalReward(calculateReward(payCredit+10,rewardRatio[rewardRatioId]))
        }}  />
        </div>

        <div className="submit-order-lotto-grid">
          <div  className="submit-order-lotto-button"
          onClick={(event) => {
            alert("เดิมพันสำเร็จ")
          }}
          >
          <h4>ใช้ {payCredit} เครดิต<br/> ยอดเงินที่จะได้รับ : {totalReward}</h4>
          </div>
        </div>
 
 
      <div className="th-page-footer">
      <button className='thal-lotto-button-footer'  onClick={() => router.push("/")}>
          หน้าหลัก
        </button>
        <button className='thal-lotto-button-footer'>
          ตรวจรางวัล
        </button>
        <button className='thal-lotto-button-footer'>
          ฝาก - ถอน
        </button>
      </div> 

    </div>
  );
}
