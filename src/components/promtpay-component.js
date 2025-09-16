import { useState, useEffect } from 'react';
import {  ClipboardCheck, X, University, UserPlus, Phone } from 'lucide-react';
import { Home, User } from "lucide-react";
import { useRouter } from "next/navigation";

// The main App component that renders the deposit and withdraw page UI.
export default function App() {
 const router = useRouter();
 const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL;
 const notiURL = process.env.NEXT_PUBLIC_NOTI_URL;
 const [currentCredit, setCurrentCredit] = useState(0);
 //const [qrDepositImg, setQrDespositImg] = useState(null);
 
 // --- Get Current Credit ---
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
 
       } catch (err) {
         console.error("Check credit balance failed:", err);
         setCurrentCredit(0); // fallback
       }
     };
     fetchCredit();
   }, []);

  // --- Core State ---
  const [mode, setMode] = useState('deposit'); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState('100');
  //const [paymentType, setPaymentType] = useState('1002');
  //const [paymentWithdrawType, setPaymentWithdrawType] = useState('2002');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Deposit-Specific State ---
  const [depositChannel, setDepositChannel] = useState('0'); // 0 = QR Code, 1 = Bank Transfer
  const [withdrawChannel, setWithdrawChannel] = useState('0'); // 0 = QR Code, 1 = Bank Transfer
  //const [payUrl, setPayUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- Withdraw-Specific State ---
  const [bankProvider, setBankProvider] = useState('KBANK'); // e.g., KBANK, SCB
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // For withdrawal success message

    // New state for the cooldown deposit logic
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0); // in seconds
// const handleDisposit = (channel) =>{
//   if(channel === '0')
//   {
//     //alert("QR")
//     setDepositChannel('0')
//     setAmount('100')
//     setPaymentType('1002')
//     setError(null)
//   }
//   else
//   {
//     //alert("BANK")
//     setDepositChannel('1')
//     setAmount('300')
//     setPaymentType('1006')
//      setError(null)
//   }
// }

// const handleWithdraw = (channel) =>{
//   if(channel === '0')
//   {
//     //alert("QR")
//     setWithdrawChannel('0')
//     setAmount(currentCredit)
//     setPaymentWithdrawType('2002')
//     setError(null)
//   }
//   else
//   {
//     //alert("BANK")
//     setWithdrawChannel('1')
//     setAmount(currentCredit)
//     setPaymentWithdrawType('2006')
//     setError(null)
//   }
// }

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
    setAmount(currentCredit)
  };

  const handleAmountChange = (e) => {
    const re = /^[0-9]*\.?[0-9]*$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };

  // Handles the "Proceed" button for deposits
  const handleProceedDeposit = async () => {
  // ---- 1. Check if the function is on cooldown and return early if so ----

   let expireQr = sessionStorage.getItem("qr_request_time");
   
    if (Date.now()  < expireQr) {
      setError('กรุณาฝากเงิน จากรายการนี้');
      return;
    }

    if(depositChannel ==='0')
    {
    if (!amount || parseFloat(amount) < 100) {
      setAmount('100');
      setError('ฝากขั้นต่ำ 100 บาท');
      return;
    }
   }
    if(depositChannel ==='1')
   {
    if (!amount || parseFloat(amount) < 300) {
      setAmount('300');
      setError('ฝากขั้นต่ำ 300 บาท');
      return;
    }
   }

    //    // Set cooldown to true and start the timer
    // setIsCooldown(true);
    // setCooldownRemaining(180); // 3 minutes = 180 seconds

    // // Set a timer to reset the cooldown after 3 minutes
    // const cooldownTimer = setTimeout(() => {
    //     setIsCooldown(false);
    //     setCooldownRemaining(0);
    //     setError(null); // Clear the error message
    // }, 3 * 60 * 1000); // 3 minutes in milliseconds

    // Use a separate interval to update the countdown display
    // const countdownInterval = setInterval(() => {
    //     setCooldownRemaining(prev => {
    //         if (prev > 0) {
    //             return prev - 1;
    //         } else {
    //             clearInterval(countdownInterval);
    //             return 0;
    //         }
    //     });
    // }, 1000);

    setIsLoading(true);
    setError(null);
    //setPayUrl(null);

    const id = sessionStorage.getItem("id");
    try {
      const response = await fetch(`${apiUrl}/bff-lotto-app/promtpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            amount: parseFloat(amount), 
            member_id: id,
        }),
      });
      if (!response.ok) 
        {

           // Clear the cooldown timer if the network request fails
        // clearTimeout(cooldownTimer);
        // clearInterval(countdownInterval);
        // setIsCooldown(false);
        // setCooldownRemaining(0);
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

    const promtpayResult = await response.json();

       if (promtpayResult) {
          //setQrDespositImg(promtpayResult.qr_img_name)
         // Use setTimeout to delay the modal opening by 5 seconds (5000 milliseconds).
          setTimeout(() => {
              setIsModalOpen(true);
          }, 1000); // 5000 milliseconds = 5 seconds

     // --- Call the Telegram API after the payment URL is successfully received ---
     const rootUrl = `${window.location.protocol}//${window.location.hostname}`;
     const telegramResponse = await fetch(`${apiUrl}/bff-lotto-app/telegram-deposit-noti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: parseFloat(amount), 
                member_id: id,
                qr_image: promtpayResult.qr_img_name,
                promtpay_id: promtpayResult.qr_id,
                promtpay_name: promtpayResult.qr_name,
                bank_provider:promtpayResult.bank_provider,
                root_url: rootUrl,
            }),
        });
        //console.log("Telegram API status:", telegramResponse.status);
        if (telegramResponse.status !== 200) {
            alert("ไม่สามารถแจ้งเตือนการฝากได้ ติดต่อ admin");
        }
         //save qr image name to sessionStorage for delete after 3 min
          sessionStorage.setItem("qr_image",promtpayResult.qr_img_name);
          //set disable deposit after 3 min 
          const threeMinutesInMilliseconds = 3 * 60 * 1000;
          const expirationTimestamp = Date.now() + threeMinutesInMilliseconds;
          sessionStorage.setItem("qr_request_time",expirationTimestamp);

       } else {
          setError(promtpayResult.message || 'Failed to get a payment URL. Please try again.');
          // Clear the cooldown timer on API-level failure
        // clearTimeout(cooldownTimer);
        // clearInterval(countdownInterval);
        // setIsCooldown(false);
        // setCooldownRemaining(0);
       }
    } catch (e) {
      setError(`An error occurred: ${e.message}`);
      //console.error('API call failed:', e);
             // Clear the cooldown timer on error
      // clearTimeout(cooldownTimer);
      // clearInterval(countdownInterval);
      // setIsCooldown(false);
      // setCooldownRemaining(0);
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

    // if (parseFloat(amount) < 100 && withdrawChannel === '0') {
    //     setError('ถอนขั้นต่ำ 100 บาท');
    //     setAmount('100')
    //     return;
    // }

    //  if (parseFloat(amount) < 300 && withdrawChannel === '1') {
    //     setError('ถอนขั้นต่ำ 300 บาท');
    //      setAmount('300')
    //     return;
    // }

         if (parseFloat(amount) > currentCredit) {
        setError('ไม่สามารถถอนเกิน : '+currentCredit+' บาท');
         setAmount(currentCredit)
        return;
    }

    setIsLoading(true);
    setError(null);
    setShowSuccess(false);

    const id = sessionStorage.getItem("id");
    try {
    const withdrawResponse = await fetch(`${apiUrl}/bff-lotto-app/telegram-withdraw-noti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: parseFloat(amount), 
                member_id: id,
                bank_provider: bankProvider,
                transfer_account: accountNumber,
                transfer_name: accountName,
                transfer_phone: phoneNumber,
            }),
        });
        //console.log("Telegram API status:", withdrawResponse);
         if (withdrawResponse.status !== 200) {
             alert("ไม่สามารถแจ้งเตือนการถอนได้ ติดต่อ admin");
           } 
    } catch (e) {
      setError(`An error occurred: ${e.message}`);
     
    } finally {
      
      
   
  }


    // try {
    //     // NOTE: Replace with your actual withdrawal API endpoint
    //     const response = await fetch(`${apiUrl}/bff-lotto-app/payout`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             amount: amount, // Corrected from 'amout'
    //             bank_provider: bankProvider,
    //             transfer_account: accountNumber,
    //             transfer_name: accountName,
    //             transfer_phone: phoneNumber,
    //             member_id: id, // Assuming member_id is also needed for withdrawal
    //             channel: withdrawChannel, //0 = QR , 1 = BANK TRANSFER 
    //             noti_url: notiURL,
	  //             fee_type:"0",
	  //             payment_type:paymentWithdrawType
    //         }),
    //     });

    //     if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

    //     const result = await response.json();
    //     //console.log('API Withdraw Response:', result);

    //     if (result.code === 0) {
    //         setShowSuccess(true);
    //         // Optionally reset the form on success
    //         setAmount('');
    //         setAccountNumber('');
    //         setAccountName('');
    //         setPhoneNumber('');
    //     } else {
    //         setError(result.message || 'Withdrawal failed. Please try again.');
    //     }

    // } catch (e) {
    //     setError(`An error occurred: ${e.message}`);
    //    // console.error('API call failed:', e);
    // } finally {
    //     setIsLoading(false);
    // }
  };


const handleDownloadQR = async () => {
    const qrImageElement = document.querySelector('img[alt="QR Code"]');
    if (!qrImageElement) return;

    try {
        // Fetch the image to ensure it's loaded and to get its blob data
        const response = await fetch(qrImageElement.src);
        const blob = await response.blob();
        
        // Create an Image object to load the fetched blob
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions to match the QR code image
            canvas.width = img.width;
            canvas.height = img.height;

            // 1. Draw the QR code image onto the canvas
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // 2. Add the watermark text
            const watermarkText = "หวยพระนคร";
            ctx.font = 'bold 30px Arial'; // Adjust font size and style as needed
            ctx.fillStyle = 'rgba(3, 230, 255, 1)'; // Red, semi-transparent
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Calculate position for the watermark (center of the image)
            const x = canvas.width / 2;
            const y = canvas.height / 2;

            ctx.fillText(watermarkText, x, y);

            // Get the PNG data URL from the canvas
            const pngUrl = canvas.toDataURL('image/png');

            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = 'QR_Payment_HuayPranakorn.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the temporary URL
            URL.revokeObjectURL(img.src); 
        };
    } catch (error) {
        console.error('Failed to download or watermark the QR code image:', error);
    }
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
              {/* <button className='flex flex-col items-center gap-1 hover:text-white'>
                <CheckCircle size={20} />
                ตรวจรางวัล
              </button> */}
              <button onClick={() => router.push("/promtpay")} className='flex flex-col items-center gap-1 hover:text-white'>
                <User size={20}/>
                ฝาก - ถอน (QR PROMT PAY)
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
            {/* {mode === 'deposit' && (
              <div>
                <h2 className="block font-medium text-xl font-bold text-white mb-2">ช่องทางการชำระเงิน</h2>
                <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleDisposit('0')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                      depositChannel === '0' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <QrCode className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">คิวอาร์โค้ด</span>
                  </button>
                  <button
                    onClick={() => handleDisposit('1')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                      depositChannel === '1' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <Banknote className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">โอน</span>
                  </button>
                  
                </div>
              </div>
            )} */}
            
            {/* --- WITHDRAW FORM --- */}
            {mode === 'withdraw' && (
              <div className="space-y-4">
               {/* <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleWithdraw('0')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                      withdrawChannel === '0' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <QrCode className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">คิวอาร์โค้ด</span>
                  </button>
                  <button
                    onClick={() => handleWithdraw('1')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                      withdrawChannel === '1' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <Banknote className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">โอน</span>
                  </button>
                  
                </div> */}
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
                        <option value="CIMB">ธนาคารซีไอเอ็มบี (CIMB)</option>
                        <option value="GSB">ธนาคารออมสิน (GSB)</option>
                        <option value="KKP">ธนาคารเกียรตินาคิน (KKP)</option> 
                        <option value="BAAC">ธนาคาร ธกส (BAAC)</option>  
                        <option value="ibank">ธนาคารอิสลาม (ibank)</option>  
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
            {error && <div onClick={() => setIsModalOpen(true)}  className="bg-red-500 text-center w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 mt-6">{error}</div>}
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
      
   

{isModalOpen && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative overflow-hidden h-[60vh] flex flex-col">
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
           
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>
        <center>
         <h4  className="text-m font-bold">กรุณาฝากเงินภายใน 3 นาที</h4>
          <h4 className="text-m font-bold">ท่านจะได้รับเครดิตทันที</h4>
          </center>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white', padding: '10px' }}>
            <img 
                src={`/qr-images/${sessionStorage.getItem("qr_image")}`}
                alt="QR Code" 
            />
        </div>
        <div className="mt-4 flex justify-center">
            <button
                onClick={handleDownloadQR}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
            >
                Save QR Code
            </button>
        </div>
    </div>
</div>
      )}
    </div>
  );
}