const { zokou } = require('../bdd/');

zokou({
  pattern: 'antifake ?(.*)', // The command pattern
  desc: lang.plugins.antifake.desc, // Description of the command
  category: 'group', // Command category (group related)
  onlyGroup: true, // Makes sure the command works only in groups
  fromMe: true, // Allows the bot to reply to messages from itself
}, async (message, match) => {
  if (!match) {
    // If no specific match, check the status of antifake
    const fake = await getFake(message.jid);
    const status = fake && fake.enabled ? 'on' : 'off';
    return message.reply(lang.plugins.antifake.example.format(status));
  }

  if (match === 'list') {
    // If the match is 'list', return a list of codes
    const codes = await antiList(message.jid, 'fake');
    if (!codes.length) return message.reply(lang.plugins.antifake.not);
    return message.reply('```' + codes.map((code, i) => `${i + 1}. ${code}`).join('\n') + '```');
  }

  if (match === 'on' || match === 'off') {
    // If the match is 'on' or 'off', enable or disable antifake
    await enableAntiFake(message.jid, match);
    return message.reply(
      lang.plugins.antifake.status.format(match === 'on' ? 'enabled' : 'disabled')
    );
  }

  // If the match is a country code, update the antifake settings
  const res = await enableAntiFake(message.jid, match);
  return message.reply(
    lang.plugins.antifake.update.format(
      res.allow.length ? res.allow.join(', ') : '',
      res.notallow.length ? res.notallow.join(', ') : ''
    )
  );
});
