import { useState } from 'react';
import { QrCode, Banknote, ClipboardCheck, X, DollarSign, University, UserPlus, Phone } from 'lucide-react';
import { Home, User, CheckCircle } from "lucide-react";

import { useRouter } from "next/navigation";

// The main App component that renders the deposit and withdraw page UI.
export default function App() {
 const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL;
  
  // Commenting out for local testing if router is not configured
  // useEffect(() => {
  //     const currentSessionId = sessionStorage.getItem("browser_session_id");
  //     const id = sessionStorage.getItem("id");
  //       if(currentSessionId === null || id === null)
  //       {
  //             // Assuming you are using Next.js router
  //             // import { useRouter } from 'next/router'
  //             // const router = useRouter();
  //             // router.push("/signin")
  //       } 
  //  }, []);

  // --- Core State ---
  const [mode, setMode] = useState('deposit'); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Deposit-Specific State ---
  const [depositChannel, setDepositChannel] = useState('1'); // 0 = QR Code, 1 = Bank Transfer
  const [payUrl, setPayUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- Withdraw-Specific State ---
  const [bankProvider, setBankProvider] = useState('KBANK'); // e.g., KBANK, SCB
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // For withdrawal success message

  // --- Handlers ---

  // Handles switching between Deposit and Withdraw modes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Reset state to avoid carrying over data between modes
    setError(null);
    setShowSuccess(false);
    setAmount('100');
    setAccountNumber('');
    setAccountName('');
    setPhoneNumber('');
  };

  const handleAmountChange = (e) => {
    const re = /^[0-9]*\.?[0-9]*$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };

  // Handles the "Proceed" button for deposits
  const handleProceedDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPayUrl(null);
    
    const id = sessionStorage.getItem("id");

    try {
      const response = await fetch(`${apiUrl}/bff-lotto-app/payin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            amount: amount, 
            channel: depositChannel,
            member_id: id,
            noti_url: "https://google.co.th",
            payment_type: "1059",
            fee_type: "0"
        }),
      });
      
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

      const result = await response.json();
      console.log('API Deposit Response:', result);

      if (result.code === 0 && result.data && result.data.payUrl) {
        setPayUrl(result.data.payUrl);
        setIsModalOpen(true);
      } else {
        setError(result.message || 'Failed to get a payment URL. Please try again.');
      }

    } catch (e) {
      setError(`An error occurred: ${e.message}`);
      console.error('API call failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles the "Proceed" button for withdrawals
  const handleProceedWithdraw = async () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0 || !bankProvider || !accountNumber || !accountName) {
        setError('กรุณากรอกข้อมูลให้ครบ');
        return;
    }

    setIsLoading(true);
    setError(null);
    setShowSuccess(false);

    const id = sessionStorage.getItem("id");

    try {
        // NOTE: Replace with your actual withdrawal API endpoint
        const response = await fetch(`${apiUrl}/bff-lotto-app/payout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount, // Corrected from 'amout'
                bank_provider: bankProvider,
                transfer_account: accountNumber,
                transfer_name: accountName,
                transfer_phone: phoneNumber,
                member_id: id, // Assuming member_id is also needed for withdrawal
                channel: "1", //0 = QR , 1 = BANK TRANSFER 
                noti_url:"https://google.co.th",
	              fee_type:"0",
	              payment_type:"2001"
            }),
        });

        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

        const result = await response.json();
        console.log('API Withdraw Response:', result);

        if (result.code === 0) {
            setShowSuccess(true);
            // Optionally reset the form on success
            setAmount('');
            setAccountNumber('');
            setAccountName('');
            setPhoneNumber('');
        } else {
            setError(result.message || 'Withdrawal failed. Please try again.');
        }

    } catch (e) {
        setError(`An error occurred: ${e.message}`);
        console.error('API call failed:', e);
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">

      {/* header menu */}
      <br/>
      <div className="mt-auto pt-4">
        <div className="flex justify-around items-center text-xs text-gray-400">
              <button  onClick={() => router.push("/thai-lotto")} className='flex flex-col items-center gap-1 hover:text-white'>
                <Home size={20} />
                หวยไทย
              </button>
              <button className='flex flex-col items-center gap-1 hover:text-white'>
                <CheckCircle size={20} />
                ตรวจรางวัล
              </button>
              <button onClick={() => router.push("/transfer")} className='flex flex-col items-center gap-1 hover:text-white'>
                <User size={20}/>
                ฝาก - ถอน
              </button>
        </div>
      </div>
       
      {/* Content wrapper */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl flex flex-col p-6">
          
          {/* Mode Tabs */}
          <div className="flex w-full bg-gray-900 rounded-xl p-1 mb-6">
            <button 
              onClick={() => handleModeChange('deposit')}
              className={`w-1/2 py-2 rounded-lg text-center font-semibold transition-all duration-300 ${mode === 'deposit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              ฝากเงิน
            </button>
            <button
              onClick={() => handleModeChange('withdraw')}
              className={`w-1/2 py-2 rounded-lg text-center font-semibold transition-all duration-300 ${mode === 'withdraw' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              ถอนเงิน
            </button>
          </div>

          <main className="flex flex-col">
            {/* Amount input section (shared) */}
            <div className="mb-6">
              <label htmlFor="amount" className="block font-medium text-xl font-bold text-white mb-2">
                จำนวนเงิน
              </label>
              <div className="relative">
                {/* <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <DollarSign size={20}/>
                </span> */}
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="100"
                  className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 text-blue-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-lg font-bold"
                />
              </div>
            </div>

            {/* --- DEPOSIT FORM --- */}
            {mode === 'deposit' && (
              <div>
                <h2 className="block font-medium text-xl font-bold text-white mb-2">ช่องทางการชำระเงิน</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDepositChannel('1')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                      depositChannel === '1' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <Banknote className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">โอน</span>
                  </button>
                  <button
                    onClick={() => setDepositChannel('0')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                      depositChannel === '0' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <QrCode className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">คิวอาร์โค้ด</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* --- WITHDRAW FORM --- */}
            {mode === 'withdraw' && (
              <div className="space-y-4">
                {/* Bank Provider */}
                 <div className="relative">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><University size={20}/></span>
                   <select
                        value={bankProvider}
                        onChange={(e) => setBankProvider(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl appearance-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="KBank">ธนาคารกสิกรไทย (KBANK)</option>
                        <option value="SCB">ธนาคารไทยพาณิชย์ (SCB)</option>
                        <option value="BBL">ธนาคารกรุงเทพ (BBL)</option>
                        <option value="KTB">ธนาคารกรุงไทย (KTB)</option>
                        <option value="BAY">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                        <option value="TMBThanachart">ธนาคารธนาชาติ (TMB)</option>
                        <option value="Krungsri">ธนาคารกรุงศรี (TMB)</option>
                        <option value="CIMB">ธนาคารซีไอเอ็มบี (CIMB)</option>
                        <option value="GSB">ธนาคารออมสิน (GSB)</option>
                        <option value="KKP">ธนาคารเกียรตินาคิน (KKP)</option> 
                        <option value="BAAC">ธนาคาร ธกส (BAAC)</option>  
                        <option value="ibank">ธนาคารอิสบาม (ibank)</option>  
       
       
       
       
                        {/* Add other banks as needed */}
                    </select>
                 </div>
                {/* Account Number */}
                <div className="relative">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><ClipboardCheck size={20}/></span>
                   <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="หมายเลขบัญชี" className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl focus:ring-2 focus:ring-green-500"/>
                </div>
                {/* Account Name */}
                <div className="relative">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><UserPlus size={20}/></span>
                   <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="ชื่อบัญชี" className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl focus:ring-2 focus:ring-green-500"/>
                </div>
                {/* Phone Number */}
                 <div className="relative">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Phone size={20}/></span>
                   <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="เบอร์โทรศัพท์" className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl focus:ring-2 focus:ring-green-500"/>
                 </div>
              </div>
            )}
            
            {/* --- Universal Messages & Button --- */}
            {isLoading && <div className="text-center text-blue-400 font-bold my-4">กำลังดำเนินการ...</div>}
            {error && <div className="bg-red-500 text-white p-3 rounded-xl my-4 text-center">{error}</div>}
            {showSuccess && <div className="bg-green-500 text-white p-3 rounded-xl my-4 text-center">ดำเนินการถอนเงินสำเร็จ!</div>}
            
            <button
              onClick={mode === 'deposit' ? handleProceedDeposit : handleProceedWithdraw}
              className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 mt-6 ${
                !amount || isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : mode === 'deposit' 
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                    : 'bg-green-600 text-white shadow-lg hover:bg-green-700'
              }`}
              disabled={!amount || isLoading}
            >
              {isLoading ? 'กำลังโหลด...' : (mode === 'deposit' ? 'ดำเนินการฝากเงิน' : 'ดำเนินการถอนเงิน')}
            </button>
          </main>
        </div>
      </div>
      
      {/* Deposit Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative overflow-hidden h-[90vh] flex flex-col">
            <div className="flex-shrink-0 flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">ดำเนินการต่อเพื่อชำระเงิน</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <iframe src={payUrl} className="flex-grow w-full border-none rounded-xl" title="Payment Webview"></iframe>
          </div>
        </div>
      )}
    </div>
  );
}