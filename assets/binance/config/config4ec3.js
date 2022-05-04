/** CONFIGURATIONS **/

const URL = "https://mmint.io/";

let splited_uri = URL.split(".");

let splited_uri2 = splited_uri[0].split("//");

const COMPANY = splited_uri2[1].toUpperCase();

const CHAIN_ID = 56; // 56 : bsc-mainnet(0x38) 97 : bsc-testnet(0x61) 

const Web3Modal = window.Web3Modal.default;

const evmChains = window.evmChains;

const TOKEN_ADDRESS = (CHAIN_ID==56)?"0x570414CDd32b200C043920E58D2d0305DB534E85":"0x5d271c5f503158Cdf537C7e313cb6f8A6A3AA467";

const BUSD_ADDRESS = (CHAIN_ID==56)?"0xe9e7cea3dedca5984780bafc599bd69add087d56":"0x3AD53Eb310bC6061baa62D900E6953601Dc90E5c";

const CONTRACT_ADDRESS = (CHAIN_ID==56)?"0xE1929Aa406a30d07bdfE0E110C738c331203a110":"0xe780319aF545f00CC1432791FCF6De0901A85868";

const TOKEN_ABI = (CHAIN_ID==56)?token_abi_mainnet:token_abi_testnet;

const BUSD_ABI = (CHAIN_ID==56)?busd_abi:token_abi_testnet;

const CONTRACT_ABI = (CHAIN_ID==56)?contract_abi_mainnet:contract_abi_testnet;

const BASE_ADDRESS = (CHAIN_ID==56)?"":"";

const GAS_FEES = "1";

const GAS_LIMIT = "3000000";

const TOKEN = (CHAIN_ID==56)?"BGV":"BSCT";

const BSCSCAN = (CHAIN_ID==56)?"https://bscscan.com/":"https://testnet.bscscan.com/";

const RPC = (CHAIN_ID==56)?"https://bsc-dataseed1.binance.org:443":"https://data-seed-prebsc-1-s1.binance.org:8545";


