import mcs from 'node-mcstatus';

const host = process.env.MINECRAFT_HOST;
const port = process.env.MINECRAFT_PORT;
const options = { query: true };

export async function isUserOnline(username) {
  try {
    const result = await mcs.statusJava(host, port, options);
    return result.players?.list.some((user) => user.name_raw === username);
  } catch {
    console.log('Error getting Minecraft server status: ', error);
  }
}
