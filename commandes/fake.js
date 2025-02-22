const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "fakereply", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    // Function to generate a random word with meaning from A-Z
    const generateRandomWord = () => {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        let wordLength = Math.floor(Math.random() * 5) + 3; // Word length between 3-7
        let word = "";

        for (let i = 0; i < wordLength; i++) {
            let randomIndex = Math.floor(Math.random() * alphabet.length);
            word += alphabet[randomIndex];
        }

        return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize first letter
    };

    let replyText = generateRandomWord();
    repondre(replyText);
});
