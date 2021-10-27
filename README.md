# cryptalert-be

Backend service for getting price data from Kraken's public price API (https://api.kraken.com/0/public/Ticker). Built with Express and Node.

## Usage

The backend service exposes an endpoint:

```
/value/:currency_1/:currency_2
```

that, if `currency_1` and `currency_2` both are valid currencies ([list of cryptocurrencies available on Kraken](https://support.kraken.com/hc/en-us/articles/360000678446)), returns an object in the format:

```
{"data":"4012.38000"}
```

NOTE: `currency_1` and `currency_2` does not have to be cryptocurrencies, but can also be fiat money (`usd`, `eur`, etc.). Have a look at [Kraken's API documentation](https://docs.kraken.com/rest/#tag/Market-Data) for more info about tradable asset pairs.

### Caching

To avoid hammering Kraken's API, the backend caches all requests towards Kraken using [node-cache](https://www.npmjs.com/package/node-cache). Whenever a successfull request that matches an asset pair in Kraken's API is made, the result is cached for 1 minute. This limits the services footprint towards the open Kraken API greatly.


### Example usage

Getting the price of 1 eth in usd:
```
/value/eth/uds -> {"data":"3995.01000"}
```

## License

The code is Copyright of Mikael Malmqvist and licensed under the MIT license
