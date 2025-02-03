function generateRequestNumber(prefix, clientName) {
  if (!clientName.trim()) {
    throw new Error("Client name cannot be empty");
  }

  const firstWord = clientName.split(" ")[0]; // Get the first word of the client name
  const randomDigits = Math.floor(Math.random() * 9000) + 1000; // Generate a random 4-digit number

  return `${prefix}-${firstWord.toUpperCase()}-${randomDigits}`;
}

module.exports = { generateRequestNumber };
