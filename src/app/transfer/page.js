"use client";
import { useState } from 'react';
import { QrCode, Banknote, ClipboardCheck, X } from 'lucide-react';
import { Home, User, CheckCircle } from "lucide-react";


// The main App component that renders the deposit page UI.
export default function App() {
  // State to manage the deposit amount input value.
  const [amount, setAmount] = useState('100');
  // State to manage the selected deposit channel, defaulting to 'qr'.
  const [channel, setChannel] = useState('1'); //0 = QR Code, 1 = Bank Transfer
  // New state to store the payment URL from the API response.
  const [payUrl, setPayUrl] = useState(null);
  // New state for showing a loading indicator during the API call.
  const [isLoading, setIsLoading] = useState(false);
  // New state for handling and displaying errors.
  const [error, setError] = useState(null);
  // State to control the visibility of the popup modal.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handles changes to the amount input field.
  const handleAmountChange = (e) => {
    // Only allow numbers and an optional decimal point.
    const re = /^[0-9]*\.?[0-9]*$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };

  // Handles the selection of a deposit channel.
  const handleChannelSelect = (selectedChannel) => {
    setChannel(selectedChannel);
  };

//   // Handles copying the payUrl to the clipboard.
//   const handleCopy = () => {
//     // Check if the URL exists before attempting to copy.
//     if (payUrl) {
//       // Use the older, more compatible clipboard API for iFrame environments.
//       const textArea = document.createElement("textarea");
//       textArea.value = payUrl;
//       document.body.appendChild(textArea);
//       textArea.select();
//       try {
//         document.execCommand('copy');
//         console.log('URL copied to clipboard!');
//       } catch (err) {
//         console.error('Failed to copy text: ', err);
//       }
//       document.body.removeChild(textArea);
//     }
//   };


  // Asynchronous function to handle the "Proceed" button.
  const handleProceed = async () => {
    if (!amount) {
      setError('Please enter a valid amount.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPayUrl(null);

    // Simulate an API call to a mock backend endpoint.
    // In a real app, you would replace this with your actual API endpoint.
    try {
      // A mock fetch response to simulate a successful API call.
      const mockResponse = {
        code: 0,
        data: {
          order_no: '12025073038d6600767af4785a64abf4c380b9af9',
          payUrl: 'https://pay.ghpay.vip/#/pay?order=12025073038d6600767af4785a64abf4c380b9af9',
        },
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = mockResponse;
      console.log('Mock API Response:', result);

      if (result.code === 0 && result.data && result.data.payUrl) {
        setPayUrl(result.data.payUrl);
        setIsModalOpen(true); // Open the modal on success
      } else {
        setError('Failed to get a payment URL. Please try again.');
      }

    } catch (e) {
      setError(`An error occurred: ${e.message}`);
      console.error('JSON parsing failed:', e);
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
            <button className='flex flex-col items-center gap-1 hover:text-white'>
              <Home size={20} />
              หน้าหลัก
            </button>
            <button className='flex flex-col items-center gap-1 hover:text-white'>
              <CheckCircle size={20} />
              ตรวจรางวัล
            </button>
            <button className='flex flex-col items-center gap-1 hover:text-white'>
              <User size={20}
               />
              ฝาก - ถอน
            </button>
          </div>
        </div>
       

      {/* Content wrapper to center the card horizontally and vertically */}
      <div className="flex-grow flex items-center justify-center p-4">
        {/* Main card for the deposit form */}
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl flex flex-col p-6 relative overflow-hidden">
          <main className="flex flex-col">
            <h1 className="text-2xl font-bold text-white text-center mb-6">ฝากเงินเข้าระบบ</h1>
            {/* Amount input section */}
            <div className="mb-6">
              <label htmlFor="amount" className="block font-medium text-xl font-bold text-white mb-2">
                จำนวนเงิน
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-blue-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-lg font-bold"
                />
              </div>
            </div>

            {/* Channel selection section */}
            <div className="mb-8">
              <h2 className="block font-medium text-xl font-bold text-white mb-2">ช่องทางการชำระเงิน</h2>
              <div className="grid grid-cols-2 gap-4">

                {/* Bank Transfer channel option */}
                <button
                  onClick={() => handleChannelSelect('1')}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    channel === '1'
                      ? 'bg-blue-600 border-blue-500 shadow-lg text-white'
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <Banknote className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">โอน</span>
                </button>


                {/* QR Code channel option */}
                <button
                  onClick={() => handleChannelSelect('0')}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    channel === '0'
                      ? 'bg-blue-600 border-blue-500 shadow-lg text-white'
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <QrCode className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">คิวอาร์โค้ด</span>
                </button>

                
              </div>
            </div>

            {/* Conditional rendering for loading and error states */}
            {isLoading && (
              <div className="text-center text-blue-400 font-bold mb-4">
                กำลังดำเนินการ...
              </div>
            )}

            {error && (
              <div className="bg-red-500 text-white p-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}
            
            {/* Proceed button */}
            <button
              onClick={handleProceed}
              className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 mt-4 ${
                amount && !isLoading
                  ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!amount || isLoading}
            >
              {isLoading ? 'กำลังโหลด...' : 'ดำเนินการ'}
            </button>
          </main>
        </div>
      </div>
      
      

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative overflow-hidden h-[90vh] flex flex-col">
            <div className="flex-shrink-0 flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">ดำเนินการต่อเพื่อชำระเงิน</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <iframe 
              src={payUrl} 
              className="flex-grow w-full border-none rounded-xl"
              title="Payment Webview"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
