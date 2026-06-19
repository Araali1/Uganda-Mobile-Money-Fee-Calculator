import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Info, 
  RefreshCw, 
  FileDown, 
  HelpCircle, 
  Languages, 
  ChevronRight, 
  Coins, 
  Flame, 
  AlertCircle, 
  Check, 
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  Phone,
  MessageSquare,
  X,
  CreditCard,
  Building,
  UserCheck
} from 'lucide-react';

// Define the Fee tables
interface FeeTier {
  min: number;
  max: number;
  fee: number;
}

const MTN_SEND_TIERS: FeeTier[] = [
  { min: 500, max: 2500, fee: 100 },
  { min: 2501, max: 5000, fee: 167 },
  { min: 5001, max: 15000, fee: 440 },
  { min: 15001, max: 30000, fee: 935 },
  { min: 30001, max: 45000, fee: 1496 },
  { min: 45001, max: 60000, fee: 1980 },
  { min: 60001, max: 125000, fee: 2750 },
  { min: 125001, max: 250000, fee: 3520 },
  { min: 250001, max: 500000, fee: 7150 },
  { min: 500001, max: 1000000, fee: 8800 },
  { min: 1000001, max: 2000000, fee: 11000 },
  { min: 2000001, max: 3000000, fee: 13200 },
  { min: 3000011, max: 5000000, fee: 15400 },
  { min: 5000001, max: 10000000, fee: 17600 }
];

const MTN_WITHDRAW_TIERS: FeeTier[] = [
  { min: 500, max: 2500, fee: 184 },
  { min: 2501, max: 5000, fee: 220 },
  { min: 5001, max: 15000, fee: 451 },
  { min: 15001, max: 20000, fee: 530 },
  { min: 20001, max: 35000, fee: 880 },
  { min: 35001, max: 50000, fee: 1300 },
  { min: 50001, max: 60000, fee: 1500 },
  { min: 60001, max: 125000, fee: 2350 },
  { min: 125001, max: 250000, fee: 3450 },
  { min: 250001, max: 500000, fee: 6600 },
  { min: 500001, max: 1000000, fee: 8400 },
  { min: 1000001, max: 2000000, fee: 10500 },
  { min: 2000001, max: 3000000, fee: 12000 },
  { min: 3000011, max: 5000000, fee: 14000 },
  { min: 5000001, max: 10000000, fee: 16500 }
];

const AIRTEL_SEND_TIERS: FeeTier[] = [
  { min: 500, max: 2500, fee: 100 },
  { min: 2501, max: 5000, fee: 165 },
  { min: 5001, max: 15000, fee: 440 },
  { min: 15001, max: 30000, fee: 900 },
  { min: 30001, max: 45000, fee: 1450 },
  { min: 45001, max: 60000, fee: 1900 },
  { min: 60001, max: 125000, fee: 2700 },
  { min: 125001, max: 250000, fee: 3450 },
  { min: 250001, max: 500000, fee: 7000 },
  { min: 500001, max: 1000000, fee: 8600 },
  { min: 1000001, max: 2000000, fee: 10800 },
  { min: 2000001, max: 3000000, fee: 13000 },
  { min: 3000011, max: 5000000, fee: 15000 },
  { min: 5000001, max: 10000000, fee: 17200 }
];

const AIRTEL_WITHDRAW_TIERS: FeeTier[] = [
  { min: 500, max: 2500, fee: 180 },
  { min: 2501, max: 5000, fee: 215 },
  { min: 5001, max: 15000, fee: 440 },
  { min: 15001, max: 20000, fee: 520 },
  { min: 20001, max: 35000, fee: 850 },
  { min: 35001, max: 50000, fee: 1250 },
  { min: 50051, max: 60000, fee: 1450 },
  { min: 60001, max: 125000, fee: 2300 },
  { min: 125001, max: 250000, fee: 3400 },
  { min: 250001, max: 500000, fee: 6500 },
  { min: 500001, max: 1000000, fee: 8200 },
  { min: 1000001, max: 2000000, fee: 10200 },
  { min: 2000001, max: 3000000, fee: 11800 },
  { min: 3000011, max: 5000000, fee: 13800 },
  { min: 5000001, max: 10000000, fee: 16000 }
];

export default function App() {
  const [network, setNetwork] = useState<'MTN' | 'AIRTEL'>('MTN');
  const [txType, setTxType] = useState<'SEND' | 'WITHDRAW'>('SEND');
  const [amountInput, setAmountInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Results state
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [resultData, setResultData] = useState<{
    network: 'MTN' | 'AIRTEL';
    txType: 'SEND' | 'WITHDRAW';
    amount: number;
    fee: number;
    totalDeducted: number;
    amountReceived: number;
  } | null>(null);

  // Active view tab (Calculator vs Tariff Guide)
  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'GUIDE'>('CALCULATOR');
  // Network filter for tariff guide
  const [guideNetwork, setGuideNetwork] = useState<'MTN' | 'AIRTEL'>('MTN');
  // Type filter for tariff guide
  const [guideType, setGuideType] = useState<'SEND' | 'WITHDRAW'>('SEND');

  // Interactive Assistant Chat State
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    { 
      sender: 'assistant', 
      text: "Olimatya! I am MomoFee Assistant, your digital guide created by Ali Nabende. Ask me about MTN or Airtel fees, or ask for a calculation. E.g., 'What's the fee to send 50,000 on Airtel?'", 
      time: 'Just now' 
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Preset quick-entry amounts
  const presetAmounts = [2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

  // Lookup function
  const findFee = (networkType: 'MTN' | 'AIRTEL', transaction: 'SEND' | 'WITHDRAW', amt: number): number | null => {
    if (amt < 500 || amt > 10000000) return null;
    
    let list: FeeTier[] = [];
    if (networkType === 'MTN') {
      list = transaction === 'SEND' ? MTN_SEND_TIERS : MTN_WITHDRAW_TIERS;
    } else {
      list = transaction === 'SEND' ? AIRTEL_SEND_TIERS : AIRTEL_WITHDRAW_TIERS;
    }

    const tier = list.find(t => amt >= t.min && amt <= t.max);
    return tier ? tier.fee : null;
  };

  const cleanNumericString = (str: string) => {
    return str.replace(/[^0-9]/g, '');
  };

  // Safe comma formatting
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-UG').format(num);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = cleanNumericString(e.target.value);
    setAmountInput(rawVal);
    setErrorMsg(null);
    setIsCalculated(false);
  };

  const handlePresetClick = (val: number) => {
    setAmountInput(val.toString());
    setErrorMsg(null);
    setIsCalculated(false);
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const parsedAmount = parseInt(amountInput, 10);
    if (isNaN(parsedAmount)) {
      setErrorMsg('Please enter a valid numeric transaction amount.');
      setIsCalculated(false);
      return;
    }

    if (parsedAmount < 500 || parsedAmount > 10000000) {
      setErrorMsg('Please enter an amount between UGX 500 and UGX 10,000,000.');
      setIsCalculated(false);
      return;
    }

    setErrorMsg(null);
    const fee = findFee(network, txType, parsedAmount);
    
    if (fee === null) {
      setErrorMsg('Unable to find fee for this amount. Please verify limits.');
      setIsCalculated(false);
      return;
    }

    // Calculations
    const totalDeducted = parsedAmount + fee; // amount sender needs to have (including charges)
    const amountReceived = parsedAmount - fee; // amount receiver gets if sender wants to deduct fee in-hand
    
    setResultData({
      network,
      txType,
      amount: parsedAmount,
      fee,
      totalDeducted,
      amountReceived
    });
    setIsCalculated(true);
  };

  const handleReset = () => {
    setAmountInput('');
    setErrorMsg(null);
    setIsCalculated(false);
    setResultData(null);
  };

  // Standalone HTML Generator
  const handleDownloadStandaloneHTML = () => {
    const mtnSendJSON = JSON.stringify(MTN_SEND_TIERS);
    const mtnWithdrawJSON = JSON.stringify(MTN_WITHDRAW_TIERS);
    const airtelSendJSON = JSON.stringify(AIRTEL_SEND_TIERS);
    const airtelWithdrawJSON = JSON.stringify(AIRTEL_WITHDRAW_TIERS);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uganda Mobile Money Fee Calculator | Offline-Ready</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        display: ['"Space Grotesk"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        mtn: {
                            gold: '#FFCB05',
                            dark: '#1e1b01',
                            blue: '#005293',
                        },
                        airtel: {
                            red: '#E30613',
                            dark: '#1b0001',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-[#F1F5F9] text-slate-850 font-sans min-h-screen py-6 px-4 flex flex-col items-center justify-center">

    <div class="w-full max-w-sm bg-white rounded-[40px] shadow-2xl border-8 border-slate-900 overflow-hidden relative">
        <!-- Brand Header Banner -->
        <div class="bg-slate-900 text-white px-6 py-7 relative overflow-hidden">
            <h1 class="text-xl font-bold tracking-tight text-white mb-1">Uganda Mobile Money</h1>
            <p class="text-yellow-400 font-extrabold tracking-widest text-[10px] uppercase mb-1">Fee Calculator</p>
            <p class="text-slate-400 text-xs">Know your MTN & Airtel charges instantly</p>
        </div>

        <!-- Form Wrapper -->
        <div class="p-6 space-y-5">
            <!-- 1. Network Selector -->
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">1. Select Network Provider</label>
                <div class="grid grid-cols-2 gap-3">
                    <button type="button" id="btn-mtn" onclick="selectNetwork('MTN')" class="py-3 px-4 rounded-xl font-bold text-sm border-2 border-amber-400 bg-amber-50 text-amber-950 transition cursor-pointer">
                        MTN MoMo
                    </button>
                    <button type="button" id="btn-airtel" onclick="selectNetwork('AIRTEL')" class="py-3 px-4 rounded-xl font-bold text-sm border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer">
                        Airtel Money
                    </button>
                </div>
            </div>

            <!-- 2. Transaction Type Selector -->
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">2. Transaction Type</label>
                <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                    <button type="button" id="btn-send" onclick="selectTxType('SEND')" class="py-2 px-3 rounded-lg font-bold text-[11px] tracking-wider uppercase text-center bg-white text-slate-900 shadow-sm transition cursor-pointer">
                        Send Money
                    </button>
                    <button type="button" id="btn-withdraw" onclick="selectTxType('WITHDRAW')" class="py-2 px-3 rounded-lg font-bold text-[11px] tracking-wider uppercase text-center text-slate-500 hover:text-slate-800 transition cursor-pointer">
                        Withdraw
                    </button>
                </div>
            </div>

            <!-- 3. Amount Field -->
            <div>
                <label for="amount-field" class="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">3. Amount (UGX)</label>
                <div class="relative bg-slate-50 border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-slate-900 focus-within:bg-white transition">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span class="text-slate-400 font-bold text-xs font-mono">UGX</span>
                    </div>
                    <input type="text" id="amount-field" placeholder="e.g. 50,000" oninput="filterInput(this)" class="w-full pl-14 pr-4 py-3 text-base font-bold font-mono text-slate-800 focus:outline-none bg-transparent">
                </div>
                <div id="error-box" class="hidden text-red-600 text-xs mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-xl border border-red-100">
                    ⚠️ <span id="error-text"></span>
                </div>
            </div>

            <!-- Predefined Amount Tags -->
            <div class="flex flex-wrap gap-1.5 pt-1">
                <button type="button" onclick="setAmount(5000)" class="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 py-1.5 px-2.5 rounded-lg font-bold font-mono">5k</button>
                <button type="button" onclick="setAmount(10000)" class="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 py-1.5 px-2.5 rounded-lg font-bold font-mono">10k</button>
                <button type="button" onclick="setAmount(20000)" class="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 py-1.5 px-2.5 rounded-lg font-bold font-mono">20k</button>
                <button type="button" onclick="setAmount(50000)" class="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 py-1.5 px-2.5 rounded-lg font-bold font-mono">50k</button>
                <button type="button" onclick="setAmount(100000)" class="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 py-1.5 px-2.5 rounded-lg font-bold font-mono">100k</button>
                <button type="button" onclick="setAmount(500000)" class="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 py-1.5 px-2.5 rounded-lg font-bold font-mono">500k</button>
            </div>

            <!-- Actions Buttons -->
            <div class="grid grid-cols-3 gap-2 pt-2">
                <button type="button" onclick="resetCalculator()" class="col-span-1 border border-slate-200 text-slate-500 hover:bg-slate-50 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer">
                    Clear
                </button>
                <button type="button" id="btn-calculate" onclick="calculateFees()" class="col-span-2 bg-slate-900 text-white hover:bg-slate-800 font-bold text-center text-xs tracking-widest uppercase py-3 rounded-xl transition shadow-md cursor-pointer">
                    Calculate Fee
                </button>
            </div>

            <!-- Animated Presentation Result Panel -->
            <div id="result-panel" class="hidden border border-slate-150 bg-slate-50/60 rounded-[28px] p-5 space-y-3.5 transition-all duration-350">
                <div class="flex items-center justify-between pb-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transaction summary</span>
                    <span id="badge-provider" class="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-yellow-400 text-black">MTN MO-MO</span>
                </div>

                <div class="space-y-2 text-xs">
                    <div class="flex justify-between items-center">
                        <span class="text-slate-500 font-medium">Tx Amount:</span>
                        <span id="res-amount" class="font-bold text-slate-850 font-mono">UGX 0</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-slate-500 font-medium">Tariff Fee:</span>
                        <span id="res-fee" class="font-bold text-red-600 font-mono">UGX 0</span>
                    </div>
                    
                    <div class="border-t border-dashed border-slate-250 pt-2.5 flex justify-between items-end">
                        <span id="label-summary" class="text-sm font-semibold text-slate-500">Total Deduction</span>
                        <span id="res-wallet-summary" class="text-xl font-black text-slate-900 font-mono underline decoration-4 decoration-yellow-400">UGX 0</span>
                    </div>
                </div>

                <div class="bg-white p-3 rounded-xl border border-slate-100 text-[10.5px] text-slate-650 leading-relaxed font-sans space-y-1 mt-1">
                    <div id="p2p-exclusive-explanation">
                        Recipient gets full <span class="font-bold" id="exp-base-amount">UGX 0</span>. Sender is debited <span class="font-extrabold text-slate-900" id="exp-total-amount">UGX 0</span>.
                    </div>
                    <div id="withdraw-exclusive-explanation" class="hidden">
                        To withdraw <span class="font-bold text-slate-800" id="exp-draw-amount">UGX 0</span> cash, your balance needs <span class="font-bold" id="exp-draw-tot">UGX 0</span>. You receive exact <span class="font-bold text-emerald-600" id="exp-draw-net">UGX 0</span> cash.
                    </div>
                </div>
                
                <!-- Side by Side Comparative Option -->
                <div class="border-t border-slate-200 pt-3 mt-1 text-[11px]">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Simultaneous Comparison</p>
                    <div class="grid grid-cols-2 gap-2 text-center text-[10px]">
                        <div class="bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                            <span class="block text-[8px] text-slate-400 uppercase font-bold">MTN Fee</span>
                            <span id="comp-mtn-fee" class="font-extrabold font-mono text-slate-800">UGX 0</span>
                        </div>
                        <div class="bg-red-50/50 p-2 rounded-xl border border-[#ED1C24]/10">
                            <span class="block text-[8px] text-slate-400 uppercase font-bold">Airtel Fee</span>
                            <span id="comp-airtel-fee" class="font-extrabold font-mono text-slate-800">UGX 0</span>
                        </div>
                    </div>
                    <p id="comp-verdict" class="text-[9.5px] text-center font-bold mt-2 uppercase tracking-wide"></p>
                </div>
            </div>
        </div>

        <!-- Static Footer inside mockup container -->
        <footer class="bg-slate-50 border-t border-slate-100 py-5 text-center px-4 shrink-0">
            <p class="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto mb-2">
                Fees are estimates based on standard published provider grids from Kampala. Confirm official fees before sending.
            </p>
            <div class="h-px bg-slate-200 w-12 mx-auto mb-2"></div>
            <p class="text-[10px] text-slate-500 font-bold font-sans">Built by Ali Nabende | Kampala, Uganda</p>
        </footer>
    </div>

    <script>
        const mtnSendTiers = ${mtnSendJSON};
        const mtnWithdrawTiers = ${mtnWithdrawJSON};
        const airtelSendTiers = ${airtelSendJSON};
        const airtelWithdrawTiers = ${airtelWithdrawJSON};

        let currentNetwork = 'MTN';
        let currentTxType = 'SEND';

        function formatCommas(num) {
            return new Intl.NumberFormat('en-UG').format(num);
        }

        function filterInput(inputField) {
            let val = inputField.value.replace(/[^0-9]/g, '');
            inputField.value = val;
            hideError();
            hideResults();
        }

        function setAmount(val) {
            const inputField = document.getElementById('amount-field');
            inputField.value = val;
            hideError();
            hideResults();
        }

        function selectNetwork(nw) {
            currentNetwork = nw;
            const btnMTN = document.getElementById('btn-mtn');
            const btnAirtel = document.getElementById('btn-airtel');

            if (nw === 'MTN') {
                btnMTN.className = "py-3 px-4 rounded-xl font-bold text-sm border-2 border-amber-400 bg-amber-50 text-amber-950 transition cursor-pointer";
                btnAirtel.className = "py-3 px-4 rounded-xl font-bold text-sm border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer";
            } else {
                btnAirtel.className = "py-3 px-4 rounded-xl font-bold text-sm border-2 border-red-500 bg-red-50 text-red-950 transition cursor-pointer";
                btnMTN.className = "py-3 px-4 rounded-xl font-bold text-sm border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer";
            }
            hideResults();
        }

        function selectTxType(type) {
            currentTxType = type;
            const btnSend = document.getElementById('btn-send');
            const btnWithdraw = document.getElementById('btn-withdraw');

            if (type === 'SEND') {
                btnSend.className = "py-2 px-3 rounded-lg font-bold text-[11px] tracking-wider uppercase text-center bg-white text-slate-900 shadow-sm transition cursor-pointer";
                btnWithdraw.className = "py-2 px-3 rounded-lg font-bold text-[11px] tracking-wider uppercase text-center text-slate-500 hover:text-slate-800 transition cursor-pointer";
            } else {
                btnWithdraw.className = "py-2 px-3 rounded-lg font-bold text-[11px] tracking-wider uppercase text-center bg-white text-slate-900 shadow-sm transition cursor-pointer";
                btnSend.className = "py-2 px-3 rounded-lg font-bold text-[11px] tracking-wider uppercase text-center text-slate-500 hover:text-slate-800 transition cursor-pointer";
            }
            hideResults();
        }

        function showError(msg) {
            const errBox = document.getElementById('error-box');
            const errMsg = document.getElementById('error-text');
            errMsg.innerText = msg;
            errBox.classList.remove('hidden');
        }

        function hideError() {
            document.getElementById('error-box').classList.add('hidden');
        }

        function hideResults() {
            document.getElementById('result-panel').classList.add('hidden');
        }

        function lookupFee(provider, type, amount) {
            if (amount < 500 || amount > 10000000) return null;
            let list = [];
            if (provider === 'MTN') {
                list = (type === 'SEND') ? mtnSendTiers : mtnWithdrawTiers;
            } else {
                list = (type === 'SEND') ? airtelSendTiers : airtelWithdrawTiers;
            }
            const match = list.find(t => amount >= t.min && amount <= t.max);
            return match ? match.fee : null;
        }

        function resetCalculator() {
            document.getElementById('amount-field').value = '';
            hideError();
            hideResults();
        }

        function calculateFees() {
            const inputVal = document.getElementById('amount-field').value;
            const amt = parseInt(inputVal, 10);

            if (isNaN(amt)) {
                showError('Please enter a valid transaction amount.');
                return;
            }
            if (amt < 500 || amt > 10000000) {
                showError('Please enter an amount between UGX 500 and UGX 10,000,000.');
                return;
            }

            hideError();

            const fee = lookupFee(currentNetwork, currentTxType, amt);
            if (fee === null) {
                showError('No tariff tier matches this amount range.');
                return;
            }

            const totalDeducted = amt + fee;
            const netAmountReceived = amt - fee;

            document.getElementById('res-amount').innerText = "UGX " + formatCommas(amt);
            document.getElementById('res-fee').innerText = "UGX " + formatCommas(fee);

            const badge = document.getElementById('badge-provider');
            const walletSummaryValue = document.getElementById('res-wallet-summary');
            const lblSummary = document.getElementById('label-summary');
            
            const p2pBlock = document.getElementById('p2p-exclusive-explanation');
            const withdrawBlock = document.getElementById('withdraw-exclusive-explanation');

            if (currentNetwork === 'MTN') {
                badge.innerText = "MTN MoMo";
                badge.className = "text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFCB05] text-black";
                walletSummaryValue.className = "text-xl font-black text-slate-900 font-mono underline decoration-4 decoration-[#FFCB05]";
            } else {
                badge.innerText = "Airtel Money";
                badge.className = "text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#ED1C24] text-white";
                walletSummaryValue.className = "text-xl font-black text-slate-900 font-mono underline decoration-4 decoration-[#ED1C24]";
            }

            if (currentTxType === 'SEND') {
                lblSummary.innerText = "Total Deduction";
                walletSummaryValue.innerText = "UGX " + formatCommas(totalDeducted);

                p2pBlock.classList.remove('hidden');
                withdrawBlock.classList.add('hidden');

                document.getElementById('exp-base-amount').innerText = "UGX " + formatCommas(amt);
                document.getElementById('exp-total-amount').innerText = "UGX " + formatCommas(totalDeducted);
            } else {
                lblSummary.innerText = "Amount Received";
                walletSummaryValue.innerText = "UGX " + formatCommas(netAmountReceived);

                p2pBlock.classList.add('hidden');
                withdrawBlock.classList.remove('hidden');

                document.getElementById('exp-draw-amount').innerText = "UGX " + formatCommas(amt);
                document.getElementById('exp-draw-tot').innerText = "UGX " + formatCommas(totalDeducted);
                document.getElementById('exp-draw-net').innerText = "UGX " + formatCommas(netAmountReceived);
            }

            // Dual Compare
            const mtnCompFee = lookupFee('MTN', currentTxType, amt);
            const airtelCompFee = lookupFee('AIRTEL', currentTxType, amt);

            document.getElementById('comp-mtn-fee').innerText = mtnCompFee ? "UGX " + formatCommas(mtnCompFee) : "N/A";
            document.getElementById('comp-airtel-fee').innerText = airtelCompFee ? "UGX " + formatCommas(airtelCompFee) : "N/A";

            const verdict = document.getElementById('comp-verdict');
            if (mtnCompFee !== null && airtelCompFee !== null) {
                if (mtnCompFee < airtelCompFee) {
                    const diff = airtelCompFee - mtnCompFee;
                    verdict.innerText = "🎉 MTN MoMo is UGX " + formatCommas(diff) + " cheaper!";
                    verdict.className = "text-[10px] text-center font-bold text-amber-600 mt-2.5 uppercase tracking-wide";
                } else if (airtelCompFee < mtnCompFee) {
                    const diff = mtnCompFee - airtelCompFee;
                    verdict.innerText = "🎉 Airtel Money is UGX " + formatCommas(diff) + " cheaper!";
                    verdict.className = "text-[10px] text-center font-bold text-red-650 mt-2.5 uppercase tracking-wide";
                } else {
                    verdict.innerText = "⚖️ Both charge the exact same fee!";
                    verdict.className = "text-[10px] text-center font-bold text-slate-500 mt-2.5 uppercase tracking-wide";
                }
            } else {
                verdict.innerText = "";
            }

            document.getElementById('result-panel').classList.remove('hidden');
        }
    </script>
</body>
</html>`;

    // Download Logic
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'uganda-mobile-money-calculator.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Assistant Chat Handler (Predefined calculations, smart and friendly responses)
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const updatedMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: userText, time: timeString }
    ];
    setChatMessages(updatedMessages);
    setChatInput('');

    // Generate assistant reply
    setTimeout(() => {
      let responseText = "Ndikuba kwocha! I didn't catch that fully. Can you ask me for a fee? E.g., 'What is the withdraw charge for 20,000 on MTN?'";
      
      const lower = userText.toLowerCase();

      // Simple keywords extraction
      const isMTN = lower.includes('mtn') || lower.includes('momo') || lower.includes('yellow');
      const isAirtel = lower.includes('airtel') || lower.includes('red');
      const isWithdraw = lower.includes('withdraw') || lower.includes('cash out') || lower.includes('cashout') || lower.includes('agent');
      const isSend = lower.includes('send') || lower.includes('transfer') || lower.includes('p2p') || lower.includes('to buy');
      
      // Look for a number
      const numMatch = lower.match(/\b\d+[,.\d]*\b/);
      let foundAmount = 0;
      if (numMatch) {
        foundAmount = parseInt(numMatch[0].replace(/[,.]/g, ''), 10);
      }

      if (lower.includes('hello') || lower.includes('hi') || lower.includes('olimatya') || lower.includes('habari') || lower.includes('how are you')) {
        responseText = "Olimatya! I am MomoFee Assistant, your Kampala-based helper. You can ask me to calculate any MTN or Airtel mobile money transaction fee between UGX 500 and UGX 10,000,000. How can I help you today?";
      } else if (lower.includes('what does this app do') || lower.includes('how to use') || lower.includes('purpose') || lower.includes('creator')) {
        responseText = "This application computes transfer (P2P) fees and withdrawal charges for MTN MoMo and Airtel Money in Uganda. Select your provider, pick 'Send' or 'Withdraw', type the amount, and tap 'Calculate'. You can also download it offline!";
      } else if (foundAmount > 0) {
        if (foundAmount < 500 || foundAmount > 10000000) {
          responseText = `UGX ${formatNumber(foundAmount)} is outside our range. In Uganda, standard mobile money tariffs apply for amounts between UGX 500 and UGX 10,000,000 only. Please enter value within this range.`;
        } else {
          // Detect provider
          const networkToUse = isAirtel ? 'AIRTEL' : 'MTN'; // default MTN if not specified
          // Detect transaction type
          const txToUse = isWithdraw ? 'WITHDRAW' : 'SEND'; // default Send

          const computedFee = findFee(networkToUse, txToUse, foundAmount);
          if (computedFee !== null) {
            if (txToUse === 'SEND') {
              const total = foundAmount + computedFee;
              responseText = `For sending **UGX ${formatNumber(foundAmount)}** on **${networkToUse === 'MTN' ? 'MTN MoMo' : 'Airtel Money'}**, the fee is **UGX ${formatNumber(computedFee)}**. To send this amount, your balance must have a total of **UGX ${formatNumber(total)}**.`;
            } else {
              responseText = `For withdrawing **UGX ${formatNumber(foundAmount)}** cash from an agent on **${networkToUse === 'MTN' ? 'MTN MoMo' : 'Airtel Money'}**, the fee is **UGX ${formatNumber(computedFee)}**. The agent will give you exactly UGX ${formatNumber(foundAmount)} cash, and your mobile account will be charged ${formatNumber(computedFee)} UGX.`;
            }
          } else {
            responseText = `I couldn't look up the fee for UGX ${formatNumber(foundAmount)}. Please ensure it's between UGX 500 and 10,000,000.`;
          }
        }
      } else if (lower.includes('cheaper') || lower.includes('compare') || lower.includes('better')) {
        responseText = "Generally, Airtel Money is slightly cheaper for sending certain high amounts, while cash withdrawal charges are competitive on both networks. Use our side-by-side comparison widget inside the results screen to see the differences instantly for any amount!";
      }

      setChatMessages(prev => [
        ...prev,
        { sender: 'assistant' as const, text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 600);
  };

  return (
    <div className="bg-[#F1F5F9] text-slate-800 font-sans min-h-screen flex items-center justify-center p-0 sm:p-5 selection:bg-amber-100 select-none">
      
      {/* Physical Device Frame (Sleek Interface) */}
      <div className="w-full sm:max-w-[400px] h-screen sm:h-[820px] bg-white sm:rounded-[48px] sm:border-[8px] sm:border-[#1E293B] relative sm:shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Phone Status Bar on Top */}
        <div className="h-11 px-8 pt-3 flex justify-between items-center bg-white text-xs font-bold text-slate-800 shrink-0 select-none border-b border-slate-50 relative z-30">
          <span>9:41</span>
          {/* Central Speaker grill / camera notch accent (aesthetic) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full hidden sm:block"></div>
          
          <div className="flex gap-1.5 items-center">
            {/* Cellular Bars */}
            <div className="flex items-end gap-0.5 h-2.5">
              <div className="w-0.5 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-0.5 h-1.5 bg-slate-800 rounded-full"></div>
              <div className="w-0.5 h-2 bg-slate-800 rounded-full"></div>
              <div className="w-0.5 h-2.5 bg-slate-300 rounded-full"></div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider">5G</span>
            {/* Battery percentage mock */}
            <div className="w-5 h-3 border border-slate-600 rounded-xs flex items-center p-0.5 relative">
              <div className="bg-slate-900 h-full w-[80%] rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Network Indicator Accent Border */}
        <div className={`h-1 w-full transition-all duration-300 ${network === 'MTN' ? 'bg-[#FFCB05]' : 'bg-[#ED1C24]'}`}></div>

        {/* Phone Scroll Content Main Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-white">
          
          <header className="px-6 pt-5 pb-3 shrink-0">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Uganda Mobile Money<br />
              Fee Calculator
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
              MTN & Airtel Tariffs 2026
            </p>
          </header>

          <div className="px-6 space-y-4 flex-1 flex flex-col">
            
            {/* Stand-alone offline utility row */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shrink-0">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Active standard rates</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadStandaloneHTML}
                className="flex items-center gap-1.5 py-1 px-2.5 bg-white hover:bg-slate-50 border border-slate-250 text-slate-755 hover:text-slate-900 font-extrabold text-[9px] uppercase tracking-wider rounded-lg cursor-pointer transition shadow-xs"
                title="Get full standalone offline calculator"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-500" />
                Offline HTML
              </button>
            </div>

            {/* Core Segment switcher (Calculator vs Tiers List) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => { setActiveTab('CALCULATOR'); setIsCalculated(false); }}
                className={`py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition duration-200 cursor-pointer text-center ${
                  activeTab === 'CALCULATOR'
                    ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Calculator
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('GUIDE')}
                className={`py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition duration-200 cursor-pointer text-center ${
                  activeTab === 'GUIDE'
                    ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tariff Guides
              </button>
            </div>

            {activeTab === 'CALCULATOR' ? (
              <div className="space-y-4 pb-6 flex-1 flex flex-col justify-start">
                
                {/* Step 1: Provider selection cards (sleek tab bar style) */}
                <div className="space-y-1.5">
                  <div className="flex p-1 bg-slate-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => { setNetwork('MTN'); setIsCalculated(false); }}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                        network === 'MTN'
                          ? 'bg-[#FFCB05] text-[#000] font-bold shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 font-semibold'
                      }`}
                    >
                      MTN MoMo
                    </button>
                    <button
                      type="button"
                      onClick={() => { setNetwork('AIRTEL'); setIsCalculated(false); }}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                        network === 'AIRTEL'
                          ? 'bg-[#ED1C24] text-[#FFF] font-bold shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 font-semibold'
                      }`}
                    >
                      Airtel Money
                    </button>
                  </div>
                </div>

                {/* Step 2: Transaction type switcher */}
                <div className="grid grid-cols-2 gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setTxType('SEND'); setIsCalculated(false); }}
                    className={`py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-wider cursor-pointer transition ${
                      txType === 'SEND'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Send Money (P2P)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTxType('WITHDRAW'); setIsCalculated(false); }}
                    className={`py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-wider cursor-pointer transition ${
                      txType === 'WITHDRAW'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Withdraw Cash
                  </button>
                </div>

                {/* Step 3: Enter Amount field */}
                <div className="space-y-1.5 shrink-0">
                  <div className="flex justify-between items-center ml-1">
                    <label htmlFor="amount-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Amount (UGX)
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">500 – 10M UGX</span>
                  </div>
                  
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-slate-400 select-none">UGX</span>
                    <input
                      id="amount-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 50,000"
                      value={amountInput}
                      onChange={handleAmountChange}
                      className={`w-full pl-14 pr-12 py-3.5 bg-slate-50 border-2 rounded-2xl focus:outline-none font-bold text-lg text-slate-900 transition-colors ${
                        errorMsg 
                          ? 'border-red-500 bg-red-50/40 text-red-900' 
                          : 'border-slate-100 focus:border-slate-900 focus:bg-white'
                      }`}
                    />
                    {amountInput && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="absolute right-3.5 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title="Clear amount"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Dynamic Shillings Text Block */}
                  {amountInput && !errorMsg && (
                    <div className="mt-1 pl-1 text-[11px] text-slate-400 font-semibold font-mono flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-slate-300" />
                      Formatted: <span className="text-slate-700 font-bold">{formatNumber(parseInt(amountInput, 10) || 0)} UGX</span>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="mt-1.5 text-red-600 text-[11px] font-bold font-sans flex items-center gap-1.5 bg-red-50 p-2.5 rounded-xl border border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                {/* Preset Chips */}
                <div className="shrink-0">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2">
                    Quick Select Amounts
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetAmounts.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetClick(val)}
                        className={`text-[9.5px] font-mono font-bold bg-slate-50 hover:bg-slate-100 hover:border-slate-300 border py-1.5 px-2 rounded-lg cursor-pointer transition ${
                          amountInput === val.toString()
                            ? (network === 'MTN' ? 'border-[#FFCB05] bg-amber-50/50 text-[#000] font-black' : 'border-[#ED1C24] bg-red-50/50 text-[#000] font-black')
                            : 'border-slate-100 text-slate-500'
                        }`}
                      >
                        {val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation action buttons row */}
                <div className="grid grid-cols-3 gap-2.5 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="col-span-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalculate()}
                    disabled={!amountInput}
                    className="col-span-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition shadow-md disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-3.5 h-3.5 text-slate-300" />
                    Calculate Fee
                  </button>
                </div>

                {/* Results Screen Segment */}
                {isCalculated && resultData && (
                  <div className="result-card active bg-slate-55 border border-slate-100 rounded-[28px] p-5.5 space-y-4 mb-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300 shrink-0">
                    
                    <div className="flex justify-between items-center pb-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Transaction Statement</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${
                        resultData.network === 'MTN' ? 'bg-[#FFCB05] text-black' : 'bg-[#ED1C24] text-white'
                      }`}>
                        {resultData.network === 'MTN' ? 'MTN MoMo' : 'Airtel Money'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Transaction Amount</span>
                      <span className="font-bold text-slate-800 font-mono">{formatNumber(resultData.amount)} UGX</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium font-sans">Transaction Fee</span>
                      <span className="font-bold text-red-650 font-mono">+{formatNumber(resultData.fee)} UGX</span>
                    </div>

                    <div className="h-px bg-slate-200"></div>

                    <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        {resultData.txType === 'SEND' ? 'Total Deduction' : 'Amount Received'}
                      </span>
                      <span className={`text-xl font-black text-slate-950 font-mono underline decoration-4 underline-offset-4 ${
                        resultData.network === 'MTN' ? 'decoration-[#FFCB05]' : 'decoration-[#ED1C24]'
                      }`}>
                        {resultData.txType === 'SEND' 
                          ? `${formatNumber(resultData.totalDeducted)} ` 
                          : `${formatNumber(resultData.amountReceived)} `
                        }
                        <span className="text-xs font-bold font-sans">UGX</span>
                      </span>
                    </div>

                    {/* Highly descriptive mini warning box */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 text-[10.5px] text-slate-650 leading-relaxed font-sans space-y-2 mt-1">
                      {resultData.txType === 'SEND' ? (
                        <p className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>
                            Recipient will receive full <strong className="text-slate-900 font-semibold">{formatNumber(resultData.amount)} UGX</strong>. Your mobile wallet balance will be debited <strong>{formatNumber(resultData.totalDeducted)} UGX</strong>.
                          </span>
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>
                              To withdraw <strong className="text-slate-900 font-semibold">{formatNumber(resultData.amount)} UGX</strong> cash with an agent, your balance needs <strong>{formatNumber(resultData.totalDeducted)} UGX</strong>.
                            </span>
                          </p>
                          <p className="text-[9.5px] text-slate-400 pl-5 font-semibold leading-normal">
                            Note: If your entire phone wallet balance is exactly {formatNumber(resultData.amount)} UGX, you will receive <strong>{formatNumber(resultData.amountReceived)} UGX</strong> cash after the {formatNumber(resultData.fee)} UGX fee is subtracted.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dual Comparator segment inside findings */}
                    <div className="pt-3.5 border-t border-slate-200/80">
                      <div className="flex items-center gap-1 mb-2.5">
                        <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                        <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                          Side-by-Side Comparison
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                        <div className={`p-2.5 rounded-xl border ${resultData.network === 'MTN' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                          <span className="block text-[8.5px] text-slate-400 uppercase font-black">MTN Fee</span>
                          <span className="font-extrabold font-mono text-slate-900">
                            {(() => {
                              const f = findFee('MTN', resultData.txType, resultData.amount);
                              return f !== null ? `${formatNumber(f)} UGX` : 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className={`p-2.5 rounded-xl border ${resultData.network === 'AIRTEL' ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                          <span className="block text-[8.5px] text-slate-400 uppercase font-black font-sans">Airtel Fee</span>
                          <span className="font-extrabold font-mono text-slate-900">
                            {(() => {
                              const f = findFee('AIRTEL', resultData.txType, resultData.amount);
                              return f !== null ? `${formatNumber(f)} UGX` : 'N/A';
                            })()}
                          </span>
                        </div>
                      </div>

                      {(() => {
                        const mtnFee = findFee('MTN', resultData.txType, resultData.amount);
                        const airtelFee = findFee('AIRTEL', resultData.txType, resultData.amount);
                        if (mtnFee !== null && airtelFee !== null) {
                          if (mtnFee < airtelFee) {
                            return (
                              <p className="text-[10px] text-center font-bold text-amber-600 mt-2.5 uppercase tracking-wide">
                                🎉 MTN MoMo is UGX {formatNumber(airtelFee - mtnFee)} cheaper!
                              </p>
                            );
                          } else if (airtelFee < mtnFee) {
                            return (
                              <p className="text-[10px] text-center font-bold text-[#ED1C24] mt-2.5 uppercase tracking-wide">
                                🎉 Airtel Money is UGX {formatNumber(mtnFee - airtelFee)} cheaper!
                              </p>
                            );
                          } else {
                            return (
                              <p className="text-[10px] text-center font-semibold text-slate-400 mt-2.5 uppercase tracking-widest font-mono">
                                ⚖️ Same rate on both networks
                              </p>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>

                  </div>
                )}

              </div>
            ) : (
              /* Tariff Guide Sheets View */
              <div className="space-y-4 pb-6 flex-1 flex flex-col justify-start">
                
                {/* Secondary Network selection */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setGuideNetwork('MTN')}
                    className={`py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer text-center transition-all ${
                      guideNetwork === 'MTN' 
                        ? 'bg-[#FFCB05] text-[#000] font-black shadow-xs' 
                        : 'text-slate-500'
                    }`}
                  >
                    MTN MoMo Tiers
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuideNetwork('AIRTEL')}
                    className={`py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer text-center transition-all ${
                      guideNetwork === 'AIRTEL' 
                        ? 'bg-[#ED1C24] text-[#FFF] font-black shadow-xs' 
                        : 'text-slate-500'
                    }`}
                  >
                    Airtel Tiers
                  </button>
                </div>

                {/* Secondary transaction type */}
                <div className="flex border-b border-slate-100 gap-4 shrink-0 px-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setGuideType('SEND')}
                    className={`pb-2 text-[10.5px] font-bold tracking-wider uppercase border-b-2 cursor-pointer transition ${
                      guideType === 'SEND' 
                        ? 'border-slate-900 text-slate-900' 
                        : 'border-transparent text-slate-400 hover:text-slate-650'
                    }`}
                  >
                    Transfer (P2P)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuideType('WITHDRAW')}
                    className={`pb-2 text-[10.5px] font-bold tracking-wider uppercase border-b-2 cursor-pointer transition ${
                      guideType === 'WITHDRAW' 
                        ? 'border-slate-900 text-slate-900' 
                        : 'border-transparent text-slate-400 hover:text-slate-650'
                    }`}
                  >
                    Withdraw Cash
                  </button>
                </div>

                {/* Scrolled items container */}
                <div className="flex-1 overflow-y-auto no-scrollbar border border-slate-100 rounded-2xl max-h-[300px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[9px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="py-2.5 px-4 font-black">Amount Range (UGX)</th>
                        <th className="py-2.5 px-4 text-right font-black">Fee (UGX)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(guideNetwork === 'MTN' 
                        ? (guideType === 'SEND' ? MTN_SEND_TIERS : MTN_WITHDRAW_TIERS)
                        : (guideType === 'SEND' ? AIRTEL_SEND_TIERS : AIRTEL_WITHDRAW_TIERS)
                      ).map((tier, index) => {
                        const parsedAmt = parseInt(amountInput, 10);
                        const isRowMatching = parsedAmt && parsedAmt >= tier.min && parsedAmt <= tier.max;
                        
                        return (
                          <tr 
                            key={index} 
                            className={`text-xs border-b border-slate-100/60 transition-colors ${
                              isRowMatching
                                ? (guideNetwork === 'MTN' ? 'bg-amber-50/70 border-l-4 border-l-amber-505 font-bold' : 'bg-red-50/50 border-l-4 border-l-red-505 font-bold')
                                : 'text-slate-700 hover:bg-slate-50/50'
                            }`}
                          >
                            <td className="py-3 px-4 font-semibold font-sans">
                              {formatNumber(tier.min)} – {formatNumber(tier.max)}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                              {formatNumber(tier.fee)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[10px] text-slate-500 leading-normal flex items-start gap-2 shrink-0">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p>Type in an amount above; we will automatically color-highlight the active row in this sheet!</p>
                </div>

              </div>
            )}

          </div>

          {/* Integrated Device Footer inside scroll viewport */}
          <footer className="mt-auto px-6 py-5 bg-slate-50 border-t border-slate-100 text-center shrink-0">
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto mb-2.5">
              Fees are estimates based on standard published provider grids from Kampala. Confirm official fees before sending.
            </p>
            <div className="h-px bg-slate-200/60 w-12 mx-auto mb-2.5"></div>
            <p className="text-[10px] text-slate-500 font-bold font-sans">
              Built by Ali Nabende | Kampala, Uganda
            </p>
          </footer>

        </div>

        {/* Collapsible Chat Assistant Bubble inside mockup bounds */}
        <div className="absolute bottom-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all cursor-pointer ${
              network === 'MTN' ? 'bg-[#FFCB05] text-[#000] hover:bg-amber-400' : 'bg-[#ED1C24] text-[#FFF] hover:bg-red-700'
            }`}
            title="Chat with Ali's Fee Assistant"
          >
            {isAssistantOpen ? (
              <X className="w-4 h-4 animate-spin" />
            ) : (
              <MessageSquare className="w-4.5 h-4.5" />
            )}
          </button>
        </div>

        {/* Collapsible Nested Chat Assistant Pane inside the physical mockup viewport */}
        {isAssistantOpen && (
          <div className="absolute inset-x-0 bottom-0 top-11 bg-slate-900/60 backdrop-blur-xs z-50 animate-in fade-in duration-200 flex flex-col justify-end">
            <div className="bg-white h-[85%] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-305">
              
              {/* Chat Title bar */}
              <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center font-extrabold text-[11px] text-amber-400">
                      AN
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900"></span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black tracking-wider uppercase">MomoFee Assistant</h3>
                    <p className="text-[9px] text-slate-400">ICT Digital Assistant • Kampala</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssistantOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages scrolled block */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 no-scrollbar" id="support-chat-history">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-[85%] text-xs leading-relaxed rounded-2xl shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-slate-950 text-white rounded-tr-none'
                        : 'bg-white border text-slate-750 rounded-tl-none border-slate-100'
                    }`}>
                      {msg.text}
                      {msg.sender === 'assistant' && (
                        <span className="block text-[8px] text-slate-400 mt-1 uppercase font-semibold text-left">
                          Ali's Assistant • {msg.time}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message inputs form */}
              <form onSubmit={handleChatSubmit} className="p-3 border-t bg-white flex gap-2 shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask e.g. MTN send fee for 100k..."
                  className="flex-1 py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-800 focus:bg-slate-50 text-slate-800"
                />
                <button
                  type="submit"
                  className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[10.5px] uppercase tracking-wider transition cursor-pointer shrink-0"
                >
                  Send
                </button>
              </form>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
