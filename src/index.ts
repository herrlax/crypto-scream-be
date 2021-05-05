import express, { Application, Request, Response } from "express";
import fetch from "node-fetch";

const app: Application = express();
const port = 9000;
const KRAKEN_API_URL = "https://api.kraken.com/0/public/Ticker";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/price/:currency_1/:currency_2",
  async (req: Request, response: Response): Promise<Response> => {
    const res = await fetch(
      `${KRAKEN_API_URL}?pair=${req.params.currency_1}${req.params.currency_2}&count=1`
    );

    const data = await res.json();

    if (data.error.length > 0) {
      return response.status(404).send({
        error: data.error[0],
      });
    }

    const priceObject = data.result[Object.keys(data.result)[0]];

    return response.status(200).send({
      data: {
        price: priceObject.c[0],
      },
    });
  }
);

try {
  app.listen(port, (): void => {
    console.info(`Listening on port ${port}`);
  });
} catch (error) {
  console.error(error.message);
}
