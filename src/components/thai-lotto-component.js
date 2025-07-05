import React, { useState, useEffect } from "react";
import { Home, User, Settings, Bell, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, CheckCircle, Receipt } from "lucide-react";

// --- Bet Item Component (Adapted from MyLottoOrder) ---
// This component displays a single past bet in the history list.
const BetItem = ({ bet }) => {
  const { type, numbers, amount, icon: Icon } = bet;
  return (
    <div className="bg-gray-800 p-3 rounded-lg flex items-center gap-4">
      <div className="bg-purple-600 p-2 rounded-lg">
        <Icon size={24} />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold">{type} - <span className="text-cyan-400">{numbers}</span></h3>
        <p className="text-sm text-gray-400">
          เดิมพัน: {amount} เครดิต
        </p>
      </div>
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


export default function ThaiLottoPage() {
  // --- Configuration ---
  const ICONS = [
    { name: "3 ตัวบน", icon: Home, digits: 3 },
    { name: "3 ตัวล่าง", icon: User, digits: 3 },
    { name: "2 ตัวบน", icon: Settings, digits: 2 },
    { name: "2 ตัวล่าง", icon: Bell, digits: 2 },
  ];

  const REWARD_RATIOS = [500, 400, 300, 200];

  // --- State Management ---
  const [currentCredit, setCurrentCredit] = useState(1000);
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

  const handleSubmit = () => {
    if (payCredit <= 0) return;

    const betNumbers = isTwoDigitMode ? `${digit2}${digit3}` : `${digit1}${digit2}${digit3}`;
    
    // Create a new bet object to add to the history
    const newBet = {
        id: `${Date.now()}-${betNumbers}`, // Create a unique ID for the key prop
        type: selectedType.name,
        numbers: betNumbers,
        amount: payCredit,
        icon: selectedType.icon
    };
    // Add the new bet to the beginning of the history array
    setBets(prevBets => [newBet, ...prevBets]);

    setShowSuccessModal(true);
    setCurrentCredit(prev => prev - payCredit);
    setTimeout(() => {
      setShowSuccessModal(false);
      handleTypeSelect(selectedTypeIndex); // Reset the form
    }, 2000);
  };

  return (
    
      
      <div className="w-full  min-h-[800px] bg-gray-900 text-white rounded-2xl shadow-2xl flex flex-col p-1 relative overflow-hidden">
        
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
            <h4 className="text-sm text-gray-400">งวด 30 กรกฏาคม 2568</h4>
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
              <div className="text-sm text-purple-200">ยอดเงินที่จะได้รับ: {totalReward.toLocaleString()}</div>
            </button>
          </div>
          {/* Bet History Section */}
          <div className="mb-4">
            <center><h4 className="text-lg font-bold text-gray-300 mb-1">ประวัติการเดิมพัน</h4></center>
            <BetHistory bets={bets} />
          </div>
        </main>

        <footer className="mt-auto pt-4">
          {/* Footer Navigation */}
          <div className="flex justify-around items-center text-xs text-gray-400">
            <button className='flex flex-col items-center gap-1 hover:text-white'>
              <Home size={20} />
              หน้าหลัก
            </button>
            <button className='flex flex-col items-center gap-1 hover:text-white'>
              <CheckCircle size={20} />
              ตรวจรางวัล
            </button>
            <button className='flex flex-col items-center gap-1 hover:text-white'>
              <User size={20} />
              ฝาก - ถอน
            </button>
          </div>
        </footer>
        
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
