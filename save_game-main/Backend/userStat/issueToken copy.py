
import xrpl
from xrpl.wallet import generate_faucet_wallet
from xrpl.clients import JsonRpcClient
import asyncio
# privateKey = EDB78F7BF8B6BCE4F4EA0D7A592BC3969413CC02D2CB43BFCF53E1B1478B724199
# PUBLICKEY = EDB26EB66594C1C3CFF0F9AD4EC7C30E5C256CC869103A71F1F33F22AC0EE214C5
# JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
# client = JsonRpcClient(JSON_RPC_URL)

# TODO: Make this belong to a cold wallet belonging to us (so we always mint from the same wallet ensuring authenticity)


def makeTransaction():
    # Connect
    testnet_url = "https://s.altnet.rippletest.net:51234"
    client = xrpl.clients.JsonRpcClient(testnet_url)

    # Get credentials from the Testnet Faucet
    # For production, instead create a Wallet instance
    faucet_url = "https://faucet.altnet.rippletest.net/accounts"
    print("Getting 2 new accounts from the Testnet faucet...")
    cold_wallet = generate_faucet_wallet(client, debug=True)
    hot_wallet = generate_faucet_wallet(client, debug=True)

    # Configure issuer (cold address) settings
    cold_settings_tx = xrpl.models.transactions.AccountSet(
        account=cold_wallet.classic_address,
        transfer_rate=0,
        tick_size=5,
        domain=bytes.hex("example.com".encode("ASCII")),
        set_flag=xrpl.models.transactions.AccountSetFlag.ASF_DEFAULT_RIPPLE,
    )
    cst_prepared = xrpl.transaction.safe_sign_and_autofill_transaction(
        transaction=cold_settings_tx,
        wallet=cold_wallet,
        client=client,
    )
    print("Sending cold address AccountSet transaction...")
    response = xrpl.transaction.send_reliable_submission(cst_prepared, client)
    print(response)

    # Configure hot address settings
    hot_settings_tx = xrpl.models.transactions.AccountSet(
        account=hot_wallet.classic_address,
        set_flag=xrpl.models.transactions.AccountSetFlag.ASF_REQUIRE_AUTH,
    )
    hst_prepared = xrpl.transaction.safe_sign_and_autofill_transaction(
        transaction=hot_settings_tx,
        wallet=hot_wallet,
        client=client,
    )
    print("Sending hot address AccountSet transaction...")
    response = xrpl.transaction.send_reliable_submission(hst_prepared, client)
    print(response)

    # Create trust line from hot to cold address
    currency_code = "FOO"
    trust_set_tx = xrpl.models.transactions.TrustSet(
        account=hot_wallet.classic_address,
        limit_amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=cold_wallet.classic_address,
            value="10000000000",  # Large limit, arbitrarily chosen
        )
    )
    ts_prepared = xrpl.transaction.safe_sign_and_autofill_transaction(
        transaction=trust_set_tx,
        wallet=hot_wallet,
        client=client,
    )
    print("Creating trust line from hot address to issuer...")
    response = xrpl.transaction.send_reliable_submission(ts_prepared, client)
    print(response)

    # Send token
    issue_quantity = "3840"
    send_token_tx = xrpl.models.transactions.Payment(
        account=cold_wallet.classic_address,
        destination=hot_wallet.classic_address,
        amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=cold_wallet.classic_address,
            value=issue_quantity
        )
    )
    pay_prepared = xrpl.transaction.safe_sign_and_autofill_transaction(
        transaction=send_token_tx,
        wallet=cold_wallet,
        client=client,
    )
    print(
        f"Sending {issue_quantity} {currency_code} to {hot_wallet.classic_address}...")
    response = xrpl.transaction.send_reliable_submission(pay_prepared, client)
    print(response)

    # Check balances
    print("Getting hot address balances...")
    response = client.request(xrpl.models.requests.AccountLines(
        account=hot_wallet.classic_address,
        ledger_index="validated",
    ))
    print(response)

    print("Getting cold address balances...")
    response = client.request(xrpl.models.requests.GatewayBalances(
        account=cold_wallet.classic_address,
        ledger_index="validated",
        hotwallet=[hot_wallet.classic_address]
    ))
    print(response)
