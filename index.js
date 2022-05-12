import fetch from 'isomorphic-fetch';
import { Coins, LCDClient } from '@terra-money/terra.js';
import { MnemonicKey } from '@terra-money/terra.js';
import { MsgExecuteContract } from '@terra-money/terra.js';

const gasPrices =  await fetch('https://bombay-fcd.terra.dev/v1/txs/gas_prices');
const gasPricesJson = await gasPrices.json();
const gasPricesCoins = new Coins(gasPricesJson); 
const lcd = new LCDClient({
  URL: "https://bombay-lcd.terra.dev/", // Use "https://lcd.terra.dev" for prod "http://localhost:1317" for localterra.
  chainID: "bombay-12", // Use "columbus-5" for production or "localterra".
  gasPrices: gasPricesCoins,
  gasAdjustment: "1.5", // Increase gas price slightly so transactions go through smoothly.
  gas: 10000000,
});


const mk = new MnemonicKey({
  mnemonic: "poverty bubble cave mutual ride ticket coil mistake acoustic cluster excuse salt obey obscure donate traffic vessel culture wagon grass giraffe device execute explain",
});
const wallet = lcd.wallet(mk);

const score = "terra1cvt2wjzt2c00u04e2h73t8x7kf65zj3vq5kwdq"; 

const owner = await lcd.wasm.contractQuery(score, {get_owner: {} }); // Fetch owner of the score contract.
console.log(owner);


//set score of token Mirror for creator
const setScore = new MsgExecuteContract(
    wallet.key.accAddress,
    score, 
    {
      enter_score_for_token: {
          address:"terra1ptd53ng2fv38gd3x5665zzr478hpq3x8g8slc5",
          score:"5",
          token:"Mirror"
      },
    },
    new Coins({ uluna: '100000' })
);

const tx = await wallet.createAndSignTx({ msgs: [setScore], feeDenoms: ['uluna'] });
const result = await lcd.tx.broadcast(tx);

const _score = await lcd.wasm.contractQuery(score, {get_score: { address:"terra1ptd53ng2fv38gd3x5665zzr478hpq3x8g8slc5",token:"Moon"} }); // Fetch owner of the score contract.
console.log(_score);

