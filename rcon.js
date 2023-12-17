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

export async function sendRconCommand(command) {
  rconClient.send(command);
}
