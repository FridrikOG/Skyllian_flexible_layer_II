const xrpl = require("xrpl");

const dev_cred = {
  // Your NFT-Devnet Credentials
  classicAddress: "rGRwjKkdBFuGjeHGQLnWgvC159D5fFDKHJ",
  secret: "sn21dNCMNKwW6MijTpap7VpxZH5wD",
  balance: 10000,
};

// Joel Cook - Decentralized image
// https://ipfs.io/ipfs/QmTQbgm8ck971MQm8hRJ9Lzxd4oxWmtf22eDSjs3TxTp1T?filename=Chef_4.png

const tokenUrl = {
  value:
    "https://ipfs.io/ipfs/Qmdwp1zgkyPFinN4s9U695aPYj832VkhX5eVSALZcH57aq?filename=young_go_5.png",
};

const NFT = () => {
  let wallet;
  let client;

  const connect = async () => {
    wallet = xrpl.Wallet.fromSeed(dev_cred.secret);
    client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");

    await client.connect();
  };

  const disconnect = async () => {
    await client.disconnect();
  };

  const getNft = async () => {
    //   Get nft
    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });

    console.log("\n\nNFT's");

    const nft_f = nfts.result.account_nfts.map((n) =>
      xrpl.convertHexToString(n.URI)
    );
    console.log(nfts);
    console.log(nfts.result.account_nfts);
    console.log(nft_f);
  };

  const createNft = async () => {
    const transactionBlob = {
      TransactionType: "NFTokenMint",
      Account: wallet.classicAddress,
      URI: xrpl.convertStringToHex(tokenUrl.value),
      // NFT is transferable to more than one account over its lifespan falgs=8
      Flags: 8,
      // 5% of something
      TransferFee: 5000,
      TokenTaxon: 0,
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet });
    console.log("Transaction result:", tx.result.meta.TransactionResult);
  };

  const deleteNft = async (tokenId) => {
    const transactionBlob = {
      TransactionType: "NFTokenBurn",
      Account: wallet.classicAddress,
      TokenID: tokenId,
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet });

    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });
  };

  return {
    connect,
    disconnect,
    getNft,
    createNft,
    deleteNft,
  };
};

const main = async () => {
  const nft = await Promise.resolve(NFT());
  await nft.connect();
  await nft.getNft();
  //   await nft.createNft();
  //   await nft.deleteNft(
  //     "00081388A91BFDE63CF99522808671B1FFD13A6769D9B0CD727D1EA000000005"
  //   );

  //   await nft.getNft();
  await nft.disconnect();
};

main();
