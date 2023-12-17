import Rcon from 'rcon';

const options = {
  tcp: true,
  challenge: true,
};

const rconClient = new Rcon(
  process.env.RCON_HOST,
  process.env.RCON_PORT,
  process.env.RCON_PASSWORD,
  options,
);

rconClient.on('auth', () => {
  console.log('Rcon authed!');
});

rconClient.on('response', (str) => {
  console.log('Got response: ' + str);
});

rconClient.on('end', () => {
  console.log('Rcon connection closed!');
});

rconClient.on('error', (err) => {
  console.error('Rcon error:', err);
});

rconClient.connect();

const MAX_RETRIES = 3;
let retryCount = 0;

export async function sendRconCommand(command) {
  try {
    rconClient.send(command);
    console.log(`Command ${command} sent successfully.`);
    return;
  } catch (error) {
    if (error.name === 'ECONNRESET' && retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(
        `Retrying sending rcon command (${retryCount}/${MAX_RETRIES})...`,
      );

      sendRconCommandWithRetry(command);
    } else {
      retryCount = 0;
      console.error(`Error sending RCON command: ${error.message}`);
      throw error; // Propagate the error if it's not an ECONNRESET or max retries reached
    }
  }
}
