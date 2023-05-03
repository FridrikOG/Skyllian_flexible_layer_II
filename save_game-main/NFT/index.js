// In browsers, use a <script> tag. In Node.js, uncomment the following line:
const xrpl = require("xrpl");

const hot_wallet_obj = {
  address: "rayc2PHeGpzjo4g1N3GDJJb58kP3FzEPWE",
  secret: "shqLDXm2A9sGM9PEyCwR8bzLxnkBg",
  balance: 1000,
};

const cold_wallet_obj = {
  address: "r6F7kQNM2Y9X8dM2SFgDJHXfJAdy8qDXL",
  secret: "sh5u1XZ7BM3BxDGSYFktZhQ4CSk5r",
  balance: 1000,
};

// Connect to wallets from seed-value (secret)

// issuer - SafeGame wallet
const cold_wallet = xrpl.Wallet.fromSeed(cold_wallet_obj.secret);

// regular user address
const hot_wallet = xrpl.Wallet.fromSeed(hot_wallet_obj.secret);

// Currency code
const currency_code = "FOO";

// Wrap code in an async function so we can use await
const main = async () => {
  // Define the network client
  try {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    console.log("Connecting...");
    await client.connect();
    console.log("Connected");

    // Configure Issuer Settings
    console.log("Setup confCold...");
    await confCold(client);
    console.log("cold config finished..");

    // Configure User wallet Settings
    console.log("Setup confHot...");
    await confHot(client);
    console.log("hot config finished..");

    // Create a Trust Line From Hot to Cold Address
    console.log("Setup Trust Line...");
    await createTrustLine(client);
    console.log("Trust Line finished..");

    console.log("Setup Send Token...");
    await sendToken(client);
    console.log("Sending Token finished..");

    // Check balances ------------------------------------------------------------
    console.log("Getting hot address balances...");
    const hot_balances = await client.request({
      command: "account_lines",
      account: hot_wallet.address,
      ledger_index: "validated",
    });
    console.log(hot_balances.result);

    console.log("Getting cold address balances...");
    const cold_balances = await client.request({
      command: "gateway_balances",
      account: cold_wallet.address,
      ledger_index: "validated",
      hotwallet: [hot_wallet.address],
    });
    console.log(cold_balances.result);

    // Disconnect when done (If you omit this, Node.js won't end the process)
    await client.disconnect();
  } catch (e) {
    console.log("Failed to connect to network!");
    console.log(e);
  }
};

const confCold = async (client) => {
  // Configure issuer (cold address) settings ----------------------------------
  const cold_settings_tx = {
    TransactionType: "AccountSet",
    Account: cold_wallet.address,
    TransferRate: 0,
    TickSize: 5,
    Domain: "6578616D706C652E636F6D", // "example.com"
    SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
    // Using tf flags, we can enable more flags in one transaction
    Flags:
      xrpl.AccountSetTfFlags.tfDisallowXRP |
      xrpl.AccountSetTfFlags.tfRequireDestTag,
  };

  const cst_prepared = await client.autofill(cold_settings_tx);
  const cst_signed = cold_wallet.sign(cst_prepared);
  console.log("Sending cold address AccountSet transaction...");
  const cst_result = await client.submitAndWait(cst_signed.tx_blob);
  if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(
      `Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.hash}`
    );
    console.log(cst_result);
  } else {
    throw `Error sending transaction: ${cst_result}`;
  }
};

const confHot = async (client) => {
  // Configure hot address settings --------------------------------------------

  const hot_settings_tx = {
    TransactionType: "AccountSet",
    Account: hot_wallet.address,
    Domain: "6578616D706C652E636F6D", // "example.com"
    // enable Require Auth so we can't use trust lines that users
    // make to the hot address, even by accident:
    SetFlag: xrpl.AccountSetAsfFlags.asfRequireAuth,
    Flags:
      xrpl.AccountSetTfFlags.tfDisallowXRP |
      xrpl.AccountSetTfFlags.tfRequireDestTag,
  };

  const hst_prepared = await client.autofill(hot_settings_tx);
  const hst_signed = hot_wallet.sign(hst_prepared);
  console.log("Sending hot address AccountSet transaction...");
  const hst_result = await client.submitAndWait(hst_signed.tx_blob);
  if (hst_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(
      `Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.hash}`
    );
  } else {
    throw `Error sending transaction: ${hst_result.result.meta.TransactionResult}`;
  }
};

const createTrustLine = async (client) => {
  // Create trust line from hot to cold address --------------------------------
  const trust_set_tx = {
    TransactionType: "TrustSet",
    Account: hot_wallet.address,
    LimitAmount: {
      currency: currency_code,
      issuer: cold_wallet.address,
      value: "10000000000", // Large limit, arbitrarily chosen
    },
  };

  const ts_prepared = await client.autofill(trust_set_tx);
  const ts_signed = hot_wallet.sign(ts_prepared);
  console.log("Creating trust line from hot address to issuer...");
  const ts_result = await client.submitAndWait(ts_signed.tx_blob);
  if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(
      `Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`
    );
  } else {
    throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`;
  }
};

const sendToken = async (client) => {
  // Send token ----------------------------------------------------------------
  const issue_quantity = "3840";
  const send_token_tx = {
    TransactionType: "Payment",
    Account: cold_wallet.address,
    Amount: {
      currency: currency_code,
      value: issue_quantity,
      issuer: cold_wallet.address,
    },
    Destination: hot_wallet.address,
    DestinationTag: 1, // Needed since we enabled Require Destination Tags
    // on the hot account earlier.
  };

  const pay_prepared = await client.autofill(send_token_tx);
  const pay_signed = cold_wallet.sign(pay_prepared);
  console.log(
    `Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`
  );
  const pay_result = await client.submitAndWait(pay_signed.tx_blob);
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(
      `Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`
    );
  } else {
    throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`;
  }
};

main();
