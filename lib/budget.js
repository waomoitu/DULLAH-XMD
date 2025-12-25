const fs = require("fs");
const path = require("path");

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
    name,
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
  if (!data[user] || data[user].length === 0) {
    return "No records found.";
  }

  let records = data[user];

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    records = records.filter((x) => {
      const d = new Date(x.date);
      return d >= fromDate && d <= toDate;
    });
  }

  let totalIncome = records
    .filter((x) => x.type === "income")
    .reduce((sum, x) => sum + x.amount, 0);

  let totalExpense = records
    .filter((x) => x.type === "expense")
    .reduce((sum, x) => sum + x.amount, 0);

  let balance = totalIncome - totalExpense;

  // Muundo wa ripoti (plain text)
  let report = `BUDGET SUMMARY\n\n`;

  report += `Income:\n`;
  records
    .filter((x) => x.type === "income")
    .forEach((x) => {
      report += `- ${x.name}: ${x.amount} (${x.remark}) [${x.id}]\n`;
    });

  report += `\nExpense:\n`;
  records
    .filter((x) => x.type === "expense")
    .forEach((x) => {
      report += `- ${x.name}: ${x.amount} (${x.remark}) [${x.id}]\n`;
    });

  report += `\nTOTAL INCOME: ${totalIncome}\n`;
  report += `TOTAL EXPENSE: ${totalExpense}\n`;
  report += `BALANCE: ${balance}\n`;

  return report;
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