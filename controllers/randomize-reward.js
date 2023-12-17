import { query } from '../database.js';
import { rewardIds } from '../utils/reward-ids.js';
import { sendRconCommand } from '../rcon.js';
import { isUserOnline } from '../utils/check-player-status.js';

export async function randomizeRewardController(req, res) {
  try {
    res.header('Access-Control-Allow-Origin', 'https://umgaming.onrender.com/');

    const username = req.body.username;

    // If user is not online, do not give him a reward
    const isOnline = await isUserOnline(username);
    if (!isOnline) {
      res.status(404);
      res.send(
        JSON.stringify({ error: `Użytkownik ${username} nie jest online!` }),
      );
      return;
    }

    // Check if the user already got a reward this day
    const claimQueryResult = await query(
      `SELECT COUNT(*) AS claim_count
    FROM player_rewards
    WHERE player_name = ?
      AND DATE(reward_date) = CURDATE();`,
      [username],
    );

    const timesClaimedThisDay = claimQueryResult[0].claim_count;

    if (timesClaimedThisDay > 0) {
      res.status(400);
      res.send(
        JSON.stringify({
          error: 'Już odebrałeś dziś nagrodę, wróć ponownie jutro',
        }),
      );
      return;
    }

    if (timesClaimedThisDay === 0) {
      // If not, randomize a reward
      const [rewardName, rewardCount, rewardReadableName] =
        rewardIds[Math.floor(Math.random() * rewardIds.length)];

      // Insert the reward into the database
      await query(
        `INSERT INTO player_rewards (player_name, reward_item, reward_date)
      VALUES (?, ?, CURDATE());`,
        [username, rewardReadableName ?? rewardName],
      );

      // Send Rcon command to the server to give user a reward
      await sendRconCommand(`give ${username} ${rewardName} ${rewardCount}`);
      await sendRconCommand(
        `say [Nagrody] ${username} otrzymał nagrodę ${
          rewardReadableName ??
          rewardName.charAt(0).toUpperCase() + rewardName.slice(1)
        } x ${rewardCount}!`,
      );

      res.status(200);
      res.send(JSON.stringify({ reward: rewardReadableName, rewardCount }));
    }
  } catch (error) {
    console.log(`Error on randomizeRewardController: ${error}`);
    res.status(500);
    res.send(JSON.stringify({ error: 'Wewnętrzny błąd serwera' }));
  }
}
