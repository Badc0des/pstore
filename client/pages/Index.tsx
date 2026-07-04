import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  isDebt: boolean;
  date: string;
}

const CATEGORIES = [
  "Bahan Bendera",
  "Hutang",
  "Alat Produksi",
  "Iklan",
  "Jasa Jahit",
  "Gaji Karyawan",
];

export default function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Bahan Bendera");
  const [isDebt, setIsDebt] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Failed to load expenses:", error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      isDebt,
      date: new Date().toISOString().split("T")[0],
    };

    setExpenses([newExpense, ...expenses]);
    setDescription("");
    setAmount("");
    setCategory("Bahan Bendera");
    setIsDebt(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDebt = expenses
    .filter((exp) => exp.isDebt)
    .reduce((sum, exp) => sum + exp.amount, 0);
  const netTotal = totalExpenses - totalDebt;

  const filteredExpenses = filterCategory
    ? expenses.filter((exp) => exp.category === filterCategory)
    : expenses;

  const filteredTotalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const filteredTotalDebt = filteredExpenses
    .filter((exp) => exp.isDebt)
    .reduce((sum, exp) => sum + exp.amount, 0);
  const filteredNetTotal = filteredTotalExpenses - filteredTotalDebt;

  const expensesByCategory = CATEGORIES.map((cat) => {
    const categoryExpenses = expenses.filter((exp) => exp.category === cat);
    return {
      category: cat,
      total: categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      count: categoryExpenses.length,
    };
  }).filter((item) => item.count > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg">
              📊
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Pencatat Pengeluaran Bisnis
              </h1>
              <p className="text-sm text-slate-500">
                Kelola keuangan bisnis bendera merah putih Anda dengan mudah
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Input Pengeluaran Baru
              </h2>

              <form onSubmit={addExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pembelian bendera"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jumlah (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDebt"
                    checked={isDebt}
                    onChange={(e) => setIsDebt(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isDebt"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Ini adalah hutang
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!description.trim() || !amount}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Tambah Pengeluaran
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Pengeluaran
                </p>
                <p className="text-2xl font-bold text-red-600">
                  Rp {totalExpenses.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Hutang
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  Rp {totalDebt.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Bersih
                </p>
                <p className={`text-2xl font-bold ${netTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
                  Rp {netTotal.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide text-slate-500">
                Filter Kategori
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterCategory === null
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Semua ({expenses.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const count = expenses.filter(
                    (exp) => exp.category === cat
                  ).length;
                  return (
                    count > 0 && (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          filterCategory === cat
                            ? "bg-red-500 text-white shadow-lg"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    )
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            {expensesByCategory.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Ringkasan per Kategori
                </h3>
                <div className="space-y-3">
                  {expensesByCategory.map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.category}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.count} item{item.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        Rp {item.total.toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expense List */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Riwayat Pengeluaran {filterCategory && `(${filterCategory})`}
              </h3>

              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-2">
                    {expenses.length === 0
                      ? "Belum ada pengeluaran"
                      : `Tidak ada pengeluaran untuk kategori ${filterCategory}`}
                  </p>
                  <p className="text-sm text-slate-400">
                    {expenses.length === 0
                      ? "Mulai dengan menambahkan pengeluaran pertama Anda"
                      : "Coba pilih kategori lain"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900">
                            {exp.description}
                          </p>
                          <div className="flex gap-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {exp.category}
                            </span>
                            {exp.isDebt && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Hutang
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500">{exp.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-slate-900 min-w-32 text-right">
                          Rp {exp.amount.toLocaleString("id-ID")}
                        </p>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
