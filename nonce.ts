const RPC_URL = "https://rpc.nexus.xyz/http";
import axios from "axios";
const { Web3 } = require("web3");
const web3 = new Web3(RPC_URL);
let addressEligibilitys: any = [];
async function main() {
  const timestamp = Date.now();
  const url = `https://gist.githubusercontent.com/trangchongcheng/3f7769b1c3fb1a6f5d44a1fee8db5831/raw/?_=${timestamp}`;
  const { data } = await axios.get(url);
  const wallets = data;
  for (let index = 0; index < wallets.length; index++) {
    const address = wallets[index];
    try {
      const nonce = await web3.eth.getTransactionCount(address);
      if (nonce != 0) {
        console.log(index, address, nonce);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  }
}
main();
