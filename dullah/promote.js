'use strict';

const { zokou } = require('../framework/zokou');

zokou(
  {
    nomCom: 'promote',
    aliases: ['makeadmin'],
    categorie: 'Group',
    reaction: '👑',
  },
  async (dest, zk, commandeOptions) => {
    const {
      ms,
      repondre,
      mention,
      infosGroupe,
      verifGroupe,
      auteurMessage,
      superUser,
      verifAdmin,
      idBot,
      auteurMsgRepondu,
      msgRepondu,
    } = commandeOptions;

    if (!verifGroupe) return repondre('❌ This command only works in groups.');
    if (!infosGroupe) return repondre('❌ Could not fetch group info.');

    if (!verifAdmin && !superUser) return repondre('❌ Only group admins can use this command.');

    const participants = infosGroupe.participants || [];
    const memberIds = participants.map(p => p.id);
    const adminIds = participants.filter(p => p.admin).map(p => p.id);

    const botPhone = (zk.user?.id || '').split(':')[0].split('@')[0];
    const isBotAdmin = participants.some(p => {
      const pPhone = (p.id || '').split(':')[0].split('@')[0].replace(/[^0-9]/g, '');
      return pPhone === botPhone && botPhone !== '' && p.admin;
    });

    if (!isBotAdmin) return repondre('❌ Bot must be admin to promote members.');

    const target =
      (msgRepondu?.key?.participant) ||
      (ms.message?.extendedTextMessage?.contextInfo?.participant) ||
      (mention && mention[0]) ||
      auteurMsgRepondu;

    if (!target) return repondre('⚠️ Reply to a user or @mention them to promote.');

    const targetPhone = target.split(':')[0].split('@')[0];
    const targetInGroup = participants.some(p => {
      const pPhone = (p.id || '').split(':')[0].split('@')[0].replace(/[^0-9]/g, '');
      return pPhone === targetPhone || p.id === target;
    });

    if (!targetInGroup) return repondre('❌ That user is not in this group.');

    const alreadyAdmin = participants.some(p => {
      const pPhone = (p.id || '').split(':')[0].split('@')[0].replace(/[^0-9]/g, '');
      return (pPhone === targetPhone || p.id === target) && p.admin;
    });

    if (alreadyAdmin) return repondre('ℹ️ That user is already an admin.');

    try {
      await zk.groupParticipantsUpdate(dest, [target], 'promote');
      await zk.sendMessage(dest, {
        text: `✅ @${targetPhone} has been promoted to admin.`,
        mentions: [target],
      });
    } catch (err) {
      console.error('[PROMOTE ERROR]', err);
      repondre('❌ Failed to promote: ' + err.message);
    }
  }
);
