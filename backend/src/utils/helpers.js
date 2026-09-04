
function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PED-${y}${m}${d}-${random}`;
}


function dayRange(dateString) {
  const start = new Date(`${dateString}T00:00:00.000`);
  const end = new Date(`${dateString}T23:59:59.999`);
  return { start, end };
}

module.exports = { generateOrderNumber, dayRange };