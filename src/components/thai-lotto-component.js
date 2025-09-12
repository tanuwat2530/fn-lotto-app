import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation';
import { Home, User, Settings, Bell, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, CheckCircle, Receipt } from "lucide-react";
import QRCode from 'react-qr-code';


	
const ThaiLotto = () =>{

  const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL;
  const router = useRouter();
       // --- Configuration ---
  const ICONS = [
    { bet_type: "TH31" , name: "3 ตัวบน", icon: Home, digits: 3 },
    { bet_type: "TH32" ,  name: "3 ตัวล่าง", icon: User, digits: 3 },
    { bet_type: "TH21" , name: "2 ตัวบน", icon: Settings, digits: 2 },
    { bet_type: "TH32" ,  name: "2 ตัวล่าง", icon: Bell, digits: 2 },
  ];

  const REWARD_DATE = "งวด 30 กรกฏาคม 2568"
  const REWARD_RATIOS = [500, 400, 300, 200];

  // --- State Management ---
  const [configTransfer, setconfigTransfer] = useState(1); //0 = GATEWAY , 1 = PROMT PAY
  const [currentCredit, setCurrentCredit] = useState(0);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [digit1, setDigit1] = useState("");
  const [digit2, setDigit2] = useState("");
  const [digit3, setDigit3] = useState("");
  const [payCredit, setPayCredit] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bets, setBets] = useState([]); // State to hold the history of bets

  // --- Derived State ---
  const selectedType = ICONS[selectedTypeIndex];
  const isTwoDigitMode = selectedType.digits === 2;
  const totalReward = payCredit * REWARD_RATIOS[selectedTypeIndex];

    
useEffect(() => {
      const fetchCredit = async () => {
      const currentSessionId = sessionStorage.getItem("browser_session_id");
      const account_id = sessionStorage.getItem("id");
      const username = sessionStorage.getItem("usename"); // fix typo?
      const bank_account_number = sessionStorage.getItem("bank_account_number");
      const bank_account_owner = sessionStorage.getItem("bank_account_owner");
      const bank_provider_id = sessionStorage.getItem("bank_provider_id");
      const identity = sessionStorage.getItem("identity");

      if (currentSessionId === null || account_id === null) {
        router.push("/signin");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/bff-lotto-app/credit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ member_id: account_id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson = await response.json();
        // console.log("Credit response:", responseJson);
        // console.log("Credit Balance :", responseJson.message.credit_balance);
        // Assuming responseJson.credit exists
        setCurrentCredit(responseJson.message.credit_balance || 0);


const history = await fetch(`${apiUrl}/bff-lotto-app/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ member_id: account_id }),
        });
 if (!history.ok) {
          throw new Error(`HTTP error! status: ${history.status}`);
        }
        const resJson = await history.json();
       const parsedData = JSON.parse(resJson.message);

        setBets(parsedData);



      } catch (err) {
        console.error("Check credit balance failed:", err);
        setCurrentCredit(0); // fallback
      }
    };
    fetchCredit();
  }, []);

// --- Bet Item Component (Adapted from MyLottoOrder) ---
// This component displays a single past bet in the history list.
const BetItem = ({ bet }) => {
  const {member , bet_type , bet_time,bet_prize ,bet_description, bet_number, bet_amount,  icon: Icon } = bet;
  return (
       <div className="space-y-2">
      {bets.map((bet, index) => (
        <div
          key={index}
          className="bg-gray-800 p-2 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
        >
          <p className="font-bold">{bet.bet_date}</p> /
          <h3 className="font-bold">
            {bet.bet_description} :{" "}
            <span className="text-cyan-400">{bet.bet_number}</span>
          </h3>{" "}
          /
          <p className="font-bold">
            เดิมพัน : {bet.bet_amount} , รางวัล :{" "}
            <span className="text-cyan-400">{bet.bet_prize}</span>
          </p>
          <button className="flex flex-col items-center gap-1 hover:text-white">
            <span className="text-green-400">รับเงินรางวัล</span>
            {/* <CheckCircle size={24} /> */}
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Bet History Component (Adapted from Playlist) ---
// This component displays the list of all past bets.
const BetHistory = ({ bets }) => {
    
  if (bets.length === 0) {
    return (
        <div className="text-center py-8 text-gray-500">
            <Receipt size={48} className="mx-auto mb-2"/>
            ยังไม่มีประวัติการเดิมพัน
        </div>
    );
  }

  return (
    <div className="space-y-3">
      {bets.map((bet) => (
        <BetItem key={bet.id} bet={bet} />
      ))}
    </div>
  );
};

  // --- Event Handlers ---
  const handleTypeSelect = (index) => {
    setSelectedTypeIndex(index);
    setDigit1("");
    setDigit2("");
    setDigit3("");
    setPayCredit(0);
  };

  const adjustPayCredit = (amount) => {
    setPayCredit(prev => {
      const newCredit = prev + amount;
      if (newCredit > currentCredit) return currentCredit;
      if (newCredit < 0) return 0;
      return newCredit;
    });
  };
  
  const handleDigitChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  const handleSubmit = async () => {
    if (payCredit <= 0) return;

    const betNumbers = isTwoDigitMode ? `${digit2}${digit3}` : `${digit1}${digit2}${digit3}`;
    if(betNumbers == "") return;
    // Create a new bet object to add to the history
    const newBet = {
        id:`${Date.now()}`, // Create a unique ID for the key prop
        bet_date: REWARD_DATE,
        bet_time: `${Date.now()}`,
        bet_type: selectedType.bet_type,
        bet_description: selectedType.name,
        bet_number: betNumbers.toString(),
        bet_amount: payCredit.toString(),
        current_amount: (currentCredit - payCredit).toString(),
        bet_prize: totalReward.toLocaleString(),
        member: sessionStorage.getItem("id"),
        icon: selectedType.icon
    };
   
    try{
    const response =  await fetch(`${apiUrl}/bff-lotto-app/bet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBet),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response}`);
        }
        const responseJson = await response.json();
        console.log("Response:", responseJson);
      } catch (err) {
        console.error("Bet failed:", err);
       
      }
        
    // Add the new bet to the beginning of the history array
   // setBets(prevBets => [newBet, ...prevBets]);

    setShowSuccessModal(true);
    setCurrentCredit(prev => prev - payCredit);
    setTimeout(() => {
      setShowSuccessModal(false);
      handleTypeSelect(selectedTypeIndex); // Reset the form
      window.location.reload();
    }, 2000);
  };

  
  return (
       <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
        {/* header menu */}
       
         <div className="mt-auto pt-4">
          <div className="flex justify-around items-center text-xs text-gray-400">
            <button  onClick={() => router.push("/thai-lotto")} className='flex flex-col items-center gap-1 hover:text-white'>
              <Home size={20} />
              หวยไทย
            </button>

            {configTransfer === 0 ? (
        // Renders when currentTransfer is 0
        <button
          onClick={() => router.push("/transfer")}
          className='flex flex-col items-center gap-1 hover:text-white'
        >
          <User size={20} />
          ฝาก - ถอน (GATEWAY)
        </button>
      ) : (
        // Renders when currentTransfer is 1
        <button
          onClick={() => router.push("/promtpay")}
          className='flex flex-col items-center gap-1 hover:text-white'
        >
          <User size={20} />
          ฝาก - ถอน (QR PROMT PAY)
        </button>
      )}

            
          </div>
        </div>
        <br/>

       
       
        {/* Scrollable Main Content Area */}
        <main className="flex-grow flex flex-col overflow-y-auto">
          {/* Bet Type Selector */}
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-300">เลือกรูปแบบเดิมพัน</h4>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {ICONS.map(({ name, icon: Icon }, index) => (
              <button
                key={name}
                onClick={() => handleTypeSelect(index)}
                className={`p-2 rounded-lg flex flex-col items-center justify-center aspect-square transition-all duration-200 ${selectedTypeIndex === index ? 'bg-purple-600 shadow-lg' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <Icon size={32} className="mb-1" />
                <span className="text-xs text-center">{name}</span>
              </button>
            ))}
          </div>

          {/* Date and Number Inputs */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-300">{REWARD_DATE}</h3>
          </div>
          <div className="flex justify-center items-center gap-3 mb-4">
            <input
              type="text"
              className={`w-20 h-24 bg-gray-800 rounded-xl text-5xl text-center font-bold transition-opacity duration-300 ${isTwoDigitMode ? 'opacity-30 cursor-not-allowed' : ''}`}
              inputMode="numeric"
              maxLength={1}
              value={digit1}
              onChange={handleDigitChange(setDigit1)}
              readOnly={isTwoDigitMode}
            />
            <input
              type="text"
              className="w-20 h-24 bg-gray-800 rounded-xl text-5xl text-center font-bold"
              inputMode="numeric"
              maxLength={1}
              value={digit2}
              onChange={handleDigitChange(setDigit2)}
            />
            <input
              type="text"
              className="w-20 h-24 bg-gray-800 rounded-xl text-5xl text-center font-bold"
              inputMode="numeric"
              maxLength={1}
              value={digit3}
              onChange={handleDigitChange(setDigit3)}
            />
          </div>

          {/* Credit and Reward Info */}
          <div className="text-center text-gray-400 text-sm mb-6">
            <p>เครดิต : <span className="font-bold text-cyan-400">{currentCredit.toLocaleString()}</span></p>
            <p>อัตราจ่าย : 1 ต่อ <span className="font-bold text-purple-400">{REWARD_RATIOS[selectedTypeIndex]}</span></p>
          </div>

          {/* Bet Amount Stepper */}
          <div className="flex items-center justify-between bg-gray-800 rounded-full p-2 mb-6">
            <button onClick={() => adjustPayCredit(-10)} className="p-3 rounded-full hover:bg-gray-700 transition-colors"><ChevronFirst size={24} /></button>
            <button onClick={() => adjustPayCredit(-1)} className="p-3 rounded-full hover:bg-gray-700 transition-colors"><ChevronLeft size={24} /></button>
            <input
              className="w-24 bg-transparent text-center text-2xl font-bold text-white focus:outline-none"
              inputMode="numeric"
              value={payCredit}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                setPayCredit(val > currentCredit ? currentCredit : val);
              }}
            />
            <button onClick={() => adjustPayCredit(1)} className="p-3 rounded-full hover:bg-gray-700 transition-colors"><ChevronRight size={24} /></button>
            <button onClick={() => adjustPayCredit(10)} className="p-3 rounded-full hover:bg-gray-700 transition-colors"><ChevronLast size={24} /></button>
          </div>

        {/* Submit Button */}
          <div className="mb-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-3 text-center transition-transform duration-200 hover:scale-105 active:scale-100 disabled:opacity-50"
              disabled={payCredit <= 0}
            >
              <div className="font-semibold">ใช้ {payCredit} เครดิต</div>
              <div className="text-sm text-purple-200">ยอดเงินที่จะได้รับ : {totalReward.toLocaleString()}</div>
            </button>
          </div>
          {/* Bet History Section */}
          <div className="mb-4">
            <center><h4 className="text-lg font-bold text-gray-300 mb-1">ประวัติการเดิมพัน</h4></center>
               <div className="space-y-2">
      {bets && bets.length > 0 ? (
  bets.map((bet, index) => (
    <div
      key={index}
      className="bg-gray-800 p-2 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
    >
      <p className="font-bold">{bet.bet_date}</p> /
      <h3 className="font-bold">
        {bet.bet_description} :{" "}
        <span className="text-cyan-400">{bet.bet_number}</span>
      </h3>{" "}
      /
      <p className="font-bold">
        เดิมพัน : {bet.bet_amount} , รางวัล :{" "}
        <span className="text-cyan-400">{bet.bet_prize}</span>
      </p>
      <button className="flex flex-col items-center gap-1 hover:text-white">
        <span className="text-green-400">รับเงินรางวัล</span>
      </button>
    </div>
  ))
) : (
  <div className="text-center py-8 text-gray-500">
            <Receipt size={48} className="mx-auto mb-2"/>
            ยังไม่มีประวัติการเดิมพัน
        </div>
)}

    </div>
          </div>
        </main>

      
        
        {/* Success Modal */}
        {showSuccessModal && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-3xl z-10">
                <CheckCircle size={80} className="text-green-400 mb-4" />
                <h2 className="text-2xl font-bold">เดิมพันสำเร็จ!</h2>
                <p className="text-gray-300">ขอให้โชคดี</p>
            </div>
        )}

      </div>
  );
}
export default ThaiLotto;
