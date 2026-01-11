import { useState, useEffect } from 'react'
import axios from 'axios'
import { Wallet, ArrowDownCircle, ArrowUpCircle, Plus } from 'lucide-react'

function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  
  // NEW: State for the form inputs.
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    // Default to Expense.
    is_expense: true
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('`${import.meta.env.VITE_API_URL}/api/transactions`')
      // Sort by latest first
      const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setTransactions(sortedData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  // NEW: Handle Form Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // NEW: Handle Submit (Sending data to backend.)
  const handleSubmit = async (e) => {
    // Stop page refresh.
    e.preventDefault() 
    if(!formData.amount || !formData.description) return alert("Fill all fields!")

    try {
      await axios.post('`${import.meta.env.VITE_API_URL}/api/transactions`', {
        ...formData,
        // Today's date.
        date: new Date().toISOString().split('T')[0]
      })
      
      // Clear form and reload list.
      setFormData({ description: '', amount: '', category: 'Food', is_expense: true })
      fetchTransactions() 
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

// Calculate totals whenever 'transactions' change.
useEffect(() => {
  const calculateFinance = () => {
    let inc = 0
    let exp = 0

    transactions.forEach(t => {
      if (t.is_expense) {
        exp += parseFloat(t.amount)
      } else {
        inc += parseFloat(t.amount)
      }
    })

    setIncome(inc)
    setExpense(exp)
    setBalance(inc - exp)
  }

  calculateFinance()
  // The dependency array ensures this runs every time 'transactions' updates.
}, [transactions])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <header className="flex items-center gap-2 mb-8 max-w-4xl mx-auto">
        <Wallet className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">CampusWallet</h1>
      </header>

      {/* SUMMARY CARDS */}
<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

  {/* Balance Card */}
  <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
    <p className="text-blue-100 text-sm font-medium">Total Balance</p>
    <h2 className="text-3xl font-bold mt-1">
      LKR {balance.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
    </h2>
  </div>

  {/* Income Card */}
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1 bg-green-100 rounded-full text-green-600">
        <ArrowUpCircle size={16} />
      </div>
      <p className="text-slate-500 text-sm font-medium">Total Income</p>
    </div>
    <h2 className="text-2xl font-bold text-slate-800"> 
      {income.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
    </h2>
  </div>

  {/* Expense Card */}
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1 bg-red-100 rounded-full text-red-600">
        <ArrowDownCircle size={16} />
      </div>
      <p className="text-slate-500 text-sm font-medium">Total Expenses</p>
    </div>
    <h2 className="text-2xl font-bold text-slate-800">
      {balance.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
    </h2>
  </div>

</div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECTION 1: ADD TRANSACTION FORM */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Toggle Expense/Income */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${formData.is_expense ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
                onClick={() => setFormData({...formData, is_expense: true})}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${!formData.is_expense ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
                onClick={() => setFormData({...formData, is_expense: false})}
              >
                Income
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input 
                type="text" 
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g. Bus Ticket to Colombo" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (LKR)</label>
                <input 
                  type="number" 
                  name="amount" 
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Data/Reload</option>
                  <option>Mahapola</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
              Add Transaction
            </button>
          </form>
        </div>

        {/* SECTION 2: TRANSACTION LIST */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent History</h2>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${t.is_expense ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {t.is_expense ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{t.description}</p>
                      <p className="text-xs text-slate-500">{t.category} • {t.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${t.is_expense ? 'text-red-600' : 'text-green-600'}`}>
                    {t.is_expense ? '-' : '+'} LKR {t.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default App