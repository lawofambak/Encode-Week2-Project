import { ethers } from "ethers"; // Need to import from "hardhat" rather than "ethers" bc of extra functionality
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

// Helper function to convert string array into bytes but has a size limit of less than 32 bytes
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    // const provider = ethers.getDefaultProvider("goerli"), {infura: ?????}; <<if you want to provide a key
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    // With arguments need to run "yarn run ts-node --files" instead of just "yarn hardhat run"
    const args = process.argv;
    const proposals = args.slice(2); // Need to slice the array bc the first 2 arguments are not necessary (return 3rd and >)
    if (proposals.length <= 0) throw new Error("Not enough arguments");
    console.log("Deploying Ballot contract");
    // Proposal examples (input paramets) are names of favorite sport: Basketball, Football, Baseball
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    let ballotContract: Ballot;
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(proposals));
    await ballotContract.deployed();
    console.log(`Contract was deployed at: ${ballotContract.address}`);
    const chairperson = await ballotContract.chairperson();
    console.log(`Chairperson address: ${chairperson}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});