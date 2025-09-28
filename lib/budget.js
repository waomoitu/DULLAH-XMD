const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const dataFile = path.join(__dirname, "budget.json");

//================= Helper Functions =================//
function loadData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}), "utf8");
  }
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");
}

//================= Add Income/Expense =================//
async function setBudget(user, type, name, amount, remark) {
  let data = loadData();

  if (!data[user]) data[user] = [];

  const id = Date.now().toString(); // unique id
  data[user].push({
    id,
    type,           // "income" or "expense"
    name: name.trim(),
    amount: parseFloat(amount),
    remark: remark || "",
    date: new Date().toLocaleDateString(),
  });

  saveData(data);

  const total = data[user]
    .filter((x) => x.type === type)
    .reduce((sum, x) => sum + x.amount, 0);

  return total;
}

//================= Delete Record =================//
async function delBudget(user, id) {
  let data = loadData();
  if (!data[user]) return false;

  const before = data[user].length;
  data[user] = data[user].filter((x) => x.id !== id);
  saveData(data);

  return data[user].length < before;
}

//================= Summary =================//
async function summary(user, from, to) {
  let data = loadData();
  if (!data[user] || data[user].length === 0) return null;

  let records = data[user];

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    records = records.filter((x) => {
      const d = new Date(x.date);
      return d >= fromDate && d <= toDate;
    });
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Header
    doc.fontSize(18).text("BUDGET SUMMARY", { underline: true });
    doc.moveDown();

    // Income
    doc.fontSize(14).text("Income:");
    records.filter(r => r.type === "income").forEach(r => {
      doc.text(`- ${r.name}: ${r.amount} (${r.remark}) [${r.id}]`);
    });

    doc.moveDown();

    // Expense
    doc.fontSize(14).text("Expense:");
    records.filter(r => r.type === "expense").forEach(r => {
      doc.text(`- ${r.name}: ${r.amount} (${r.remark}) [${r.id}]`);
    });

    // Totals
    const totalIncome = records.filter(x => x.type === "income").reduce((sum, x) => sum + x.amount, 0);
    const totalExpense = records.filter(x => x.type === "expense").reduce((sum, x) => sum + x.amount, 0);
    const balance = totalIncome - totalExpense;

    doc.moveDown();
    doc.text(`TOTAL INCOME: ${totalIncome}`);
    doc.text(`TOTAL EXPENSE: ${totalExpense}`);
    doc.text(`BALANCE: ${balance}`);

    doc.end();
  });
}

//================= Date Validation =================//
function isValidDate(dateString) {
  return !isNaN(new Date(dateString).getTime());
}

module.exports = {
  setBudget,
  delBudget,
  summary,
  isValidDate,
};