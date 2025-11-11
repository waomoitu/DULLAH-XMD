const { zokou } = require("../framework/zokou");
const moment = require("moment");

// Age calculator command
zokou(
  {
    nomCom: "age",
    categorie: "utility",
    reaction: "🎉",
    desc: "Calculate your age based on your date of birth.",
    use: ".age <DD/MM/YYYY>"
  },
  async (dest, zk, { repondre, arg }) => {
    try {
      if (!arg[0]) {
        return repondre("❌ Please provide your date of birth in the format DD/MM/YYYY.\nExample: `.age 15/08/1995`");
      }

      const birthDate = arg[0]; // e.g., "15/08/1995"
      const dateOfBirth = moment(birthDate, "DD/MM/YYYY");

      // Validate date
      if (!dateOfBirth.isValid()) {
        return repondre("❌ Invalid date format. Please use DD/MM/YYYY.\nExample: `.age 15/08/1995`");
      }

      // Calculate age
      const age = moment().diff(dateOfBirth, "years");

      // Send result
      repondre(`🎉 Your age is: *${age}* years old.`);

    } catch (error) {
      console.error("Error calculating age:", error.message);
      repondre("❌ An error occurred while calculating your age. Please try again later.");
    }
  }
);
