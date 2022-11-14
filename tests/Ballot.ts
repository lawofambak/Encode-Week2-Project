import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat"; // Need to import from "hardhat" rather than "ethers" bc of extra functionality
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Raspberry", "Pistacchio", "Vanilla"];

// Helper function to convert string array into bytes but has a size limit of less than 32 bytes
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

describe("Ballot", () => {
    let ballotContract: Ballot;
    let accounts: SignerWithAddress[];

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const ballotContractFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(PROPOSALS));
        await ballotContract.deployed();
    });

    describe("When the contract is deployed", async () => {
        // Use Debug function and console to see errors
        it("has provied proposals", async () => {
            // Cannot get whole array entirely with getter function like "proposals()"
            // Can get individual struct with "ethers.utils.parseBytes32String(proposal.name)"
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.equal(PROPOSALS[index]);
            }
        });
        it("sets the deployer address as chairperson", async () => {
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.equal(accounts[0].address);
        });
        it("sets the voting weight for the chairperson as 1", async () => {
            const chairpersonVoter = await ballotContract.voters(accounts[0].address);
            expect(chairpersonVoter.weight).to.equal(1);
        });
    });
});