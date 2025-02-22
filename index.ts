import axios from "axios";

const { Web3 } = require("web3");
const RPC_URL = "https://rpc.nexus.xyz/http";
const web3 = new Web3(RPC_URL);

const PRIVATE_KEY = ""; // Nhập private key có 0x ở đầu
const ACCOUNT = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
const DELAY_TX = 10000; // 10 giây mỗi giao dịch

async function getBalance(address: any) {
  try {
    const balance = await web3.eth.getBalance(address);
    console.log(
      `[Số dư ví:  ${address}:`,
      web3.utils.fromWei(balance, "ether"),
      "ETH]\n"
    );
    return balance;
  } catch (error) {
    console.error("Lỗi khi lấy số dư:", error);
    return "0";
  }
}

async function sendRandomNativeToken() {
  await getBalance(ACCOUNT.address);
  const timestamp = Date.now();
  const url = `https://gist.githubusercontent.com/trangchongcheng/3f7769b1c3fb1a6f5d44a1fee8db5831/raw/?_=${timestamp}`;
  const { data } = await axios.get(url);
  const wallets = data;

  for (let i = 0; i < wallets.length; i++) {
    const recipientAddress = wallets[i];
    const nonce = await web3.eth.getTransactionCount(recipientAddress);
    const amount = web3.utils.toWei(
      (0.01 + Math.random() * 0.15).toFixed(2),
      "ether"
    );

    const tx = {
      from: ACCOUNT.address,
      to: recipientAddress,
      value: amount,
      gas: 21000,
      gasPrice: (await web3.eth.getGasPrice()) * 5n,
    };

    try {
      const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(
        `Giao dịch ${i + 1}/${wallets.length} thành công ${web3.utils.fromWei(
          amount,
          "ether"
        )} $NEX to: ${recipientAddress} (tổng tx: ${nonce}), tx: `,
        receipt.transactionHash
      );
    } catch (error) {
      console.error(`Lỗi khi gửi giao dịch ${i + 1}:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, DELAY_TX));
  }

  console.log("Hoàn thành gửi token $NEX\n");
  await getBalance(ACCOUNT.address);
}

async function runWithRandomDelay() {
  await sendRandomNativeToken();
  const randomDelay = (5 + Math.random() * 5) * 60 * 1000; // Random từ 5 đến 10 phút
  console.log(
    `============= ĐỢI ${
      randomDelay / 1000 / 60
    } PHÚT CHẠY LẠI...==============\n\n`
  );
  setTimeout(runWithRandomDelay, randomDelay);
}

runWithRandomDelay();
