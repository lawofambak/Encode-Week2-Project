import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    let ballotContract: Ballot;
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = ballotContractFactory.attach(contractAddress);
    let winnerName = await ballotContract.winnerName();
    winnerName = ethers.utils.parseBytes32String(winnerName);
    console.log(`Winning proposal name: ${winnerName}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});