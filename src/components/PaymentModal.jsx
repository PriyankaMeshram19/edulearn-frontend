import { useState } from "react";
import api from "../services/api";

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Kotak Mahindra Bank"];

export default function PaymentModal({ course, onClose, onSuccess }) {
  const [tab, setTab] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  const validateCard = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length !== 16) return "Card number must be 16 digits.";
    if (!cardName.trim()) return "Enter the name on card.";
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return "Enter expiry in MM/YY format.";
    const month = parseInt(match[1], 10);
    const year = parseInt("20" + match[2], 10);
    if (month < 1 || month > 12) return "Enter a valid month (01-12).";
    const now = new Date();
    const expDate = new Date(year, month);
    if (expDate < now) return "Card has expired.";
    if (cvv.length !== 3) return "CVV must be 3 digits.";
    return "";
  };

  const validateUpi = () => {
    const pattern = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
    if (!pattern.test(upiId)) return "Enter a valid UPI ID (e.g. name@upi).";
    return "";
  };

  const submitPayment = async (method) => {
    setError("");
    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const res = await api.post("/payment/simulate", {
        courseId: course.id,
        paymentMethod: method,
      });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const validationError = validateCard();
    if (validationError) { setError(validationError); return; }
    submitPayment("CARD");
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    const validationError = validateUpi();
    if (validationError) { setError(validationError); return; }
    submitPayment("UPI");
  };

  const handleNetBankingSubmit = (e) => {
    e.preventDefault();
    submitPayment("NETBANKING - " + selectedBank);
  };

  const handleQrConfirm = () => {
    submitPayment("QR_CODE");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-purple-500 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Pay for</p>
            <p className="font-semibold">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
        </div>

        <div className="px-5 py-3 border-b flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500">Amount payable</span>
          <span className="text-xl font-bold text-gray-800">₹{course.price}</span>
        </div>

        <div className="flex border-b text-sm">
          {[
            { id: "card", label: "Card" },
            { id: "upi", label: "UPI" },
            { id: "netbanking", label: "Net Banking" },
            { id: "qr", label: "QR Code" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(""); }}
              className={`flex-1 py-3 font-medium ${
                tab === t.id ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {error && (
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-md p-2 text-sm mb-4">
              {error}
            </p>
          )}

          {processing ? (
            <div className="flex flex-col items-center py-10">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-sm">Processing your payment...</p>
            </div>
          ) : (
            <>
              {tab === "card" && (
                <form onSubmit={handleCardSubmit} className="flex flex-col gap-3" autoComplete="off">
                  <input placeholder="Name on card" value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2.5 text-sm" />
                  <input placeholder="1234 5678 9012 3456" value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="border border-gray-300 rounded-lg p-2.5 text-sm" />
                  <div className="flex gap-3">
                    <input placeholder="MM/YY" value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="border border-gray-300 rounded-lg p-2.5 text-sm w-1/2" />
                    <input placeholder="CVV" type="password" maxLength={3} value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      className="border border-gray-300 rounded-lg p-2.5 text-sm w-1/2" />
                  </div>
                  <button type="submit"
                    className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg text-sm mt-2">
                    Pay ₹{course.price}
                  </button>
                </form>
              )}

              {tab === "upi" && (
                <form onSubmit={handleUpiSubmit} className="flex flex-col gap-3" autoComplete="off">
                  <input placeholder="yourname@upi" value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2.5 text-sm" />
                  <p className="text-xs text-gray-400">e.g. priyanka@okhdfcbank, 9876543210@ybl</p>
                  <button type="submit"
                    className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg text-sm mt-2">
                    Pay ₹{course.price}
                  </button>
                </form>
              )}

              {tab === "netbanking" && (
                <form onSubmit={handleNetBankingSubmit} className="flex flex-col gap-3">
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2.5 text-sm">
                    {BANKS.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <button type="submit"
                    className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg text-sm mt-2">
                    Proceed to {selectedBank}
                  </button>
                </form>
              )}

              {tab === "qr" && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg p-3">
                    <svg viewBox="0 0 29 29" className="w-full h-full">
                      <rect width="29" height="29" fill="white" />
                      {[[0,0],[22,0],[0,22]].map(([x,y], idx) => (
                        <g key={idx}>
                          <rect x={x} y={y} width="7" height="7" fill="#111" />
                          <rect x={x+1} y={y+1} width="5" height="5" fill="white" />
                          <rect x={x+2} y={y+2} width="3" height="3" fill="#111" />
                        </g>
                      ))}
                      {Array.from({ length: 29 }).map((_, row) =>
                        Array.from({ length: 29 }).map((_, col) => {
                          const inCorner =
                            (row < 8 && col < 8) || (row < 8 && col > 20) || (row > 20 && col < 8);
                          if (inCorner) return null;
                          const shouldFill = (row * 7 + col * 13 + row * col) % 3 === 0;
                          return shouldFill ? (
                            <rect key={`${row}-${col}`} x={col} y={row} width="1" height="1" fill="#111" />
                          ) : null;
                        })
                      )}
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Scan this QR using any UPI app</p>
                  <button onClick={handleQrConfirm}
                    className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white font-semibold py-2.5 px-6 rounded-lg text-sm mt-2">
                    I've completed the payment
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}