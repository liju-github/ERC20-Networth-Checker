const Moralis = require('moralis').default;
const fs = require('fs');

const Moralis_API_Key = '';
const address = '';
const chains = ['137', '1', '43114', '42161']; // Add the chain IDs you want to loop through
const networks = ['Polygon', 'Ethereum', 'Avalanche', 'Arbitrum']; // Map the chain IDs to the corresponding network names

async function main() {
  try {
    await Moralis.start({ apiKey: Moralis_API_Key });

    const networth = [];

    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i];
      const network = networks[i];

      const balanceCheck = await Moralis.EvmApi.token.getWalletTokenBalances({ address, chain });
      const jsonResponse = balanceCheck.toJSON();
      const updatedResponse = jsonResponse.map(token => ({
        ...token,
        UpdatedBalance: parseFloat(token.balance) / 10 ** token.decimals,
        network: network, // Add the network property to differentiate the balance in the JSON
      }));
      const filteredBalance = updatedResponse.filter(token => !token.possible_spam);
      networth.push(...filteredBalance);
    }

    for (const token of networth) {
      console.log(`Token Name: ${token.name} || Network: ${token.network} || Balance:(${token.UpdatedBalance})${token.symbol}`);
    }


    console.log(`Balance Fetch Finished`);
    fs.writeFileSync('networth.json', JSON.stringify(networth, null, 2));
    console.log('balance fetch successful');
  } catch (error) {
    console.error(error);
  }
}

main();
