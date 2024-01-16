# https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?vs_currencies=usd&include_24hr_change=true&contract_addresses=0x23c5d1164662758b3799103effe19cc064d897d6
import requests
import sys


URL = "https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?vs_currencies=usd&include_24hr_change=true&contract_addresses=0x23c5d1164662758b3799103effe19cc064d897d6"
HEADERS = {}

def main():
    try:
        pxs = requests.get(URL, headers=HEADERS).json()
        return pxs['0x23c5d1164662758b3799103effe19cc064d897d6']['usd']
    except Exception as e:
        raise e

if __name__ == "__main__":
    try:
        print('{0:.4f}'.format(main()))
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)