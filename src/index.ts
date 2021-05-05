import express, { Application, Request, Response } from "express";
import fetch from "node-fetch";
import NodeCache from "node-cache";

const PORT = 9000;
const KRAKEN_API_URL = "https://api.kraken.com/0/public/Ticker";
const TIME_TO_LIVE = 2 * 60; // invalidate cache after 2 minutes

const app: Application = express();
const cache = new NodeCache({ stdTTL: TIME_TO_LIVE, checkperiod: 0 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getPrice = async (currency1: string, currency2: string) => {
  const res = await fetch(
    `${KRAKEN_API_URL}?pair=${currency1}${currency2}&count=1`
  );

  const data = await res.json();

  if (data.error.length > 0) {
    return {
      error: data.error[0],
    };
  }

  return { price: data.result[Object.keys(data.result)[0]].c[0] };
};

app.get(
  "/price/:currency_1/:currency_2",
  async (req: Request, response: Response): Promise<Response> => {
    const currency1 = req.params.currency_1;
    const currency2 = req.params.currency_2;

    const cachedValue = cache.get(`${currency1}${currency2}`);

    if (cachedValue) {
      return response.status(200).send({
        data: cachedValue,
      });
    }

    const data = await getPrice(currency1, currency2);

    if (data.error) {
      return response.status(404).send({
        error: data.error,
      });
    }

    cache.set(`${currency1}${currency2}`, data.price);

    return response.status(200).send({
      data: data.price,
    });
  }
);

try {
  app.listen(PORT, (): void => {
    console.info(`Listening on port ${PORT}`);
  });
} catch (error) {
  console.error(error.message);
}
