import express, { Application, Request, Response } from "express";
import fetch from "node-fetch";

const app: Application = express();
const port = 9000;
const KRAKEN_API_URL = "https://api.kraken.com/0/public/Ticker";

const ETH_USD = "ethusd";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/price",
  async (req: Request, response: Response): Promise<Response> => {
    const res = await fetch(`${KRAKEN_API_URL}?pair=${ETH_USD}&count=1`);
    const data = await res.json();

    return response.status(200).send({
      data: data.result.XETHZUSD.c[0],
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
