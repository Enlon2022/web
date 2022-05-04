let addressInfo="";
let account = "";

// Web3modal instance
//let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

function init() {

    console.log("Initializing example");
    //console.log("WalletConnectProvider is", WalletConnectProvider);
    // console.log("Fortmatic is", Fortmatic);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    // Check that the web page is run in a secure context,
    // as otherwise MetaMask won't be available
    // if(location.protocol !== 'https:') {
    //   // https://ethereum.stackexchange.com/a/62217/620
    //   const alert = document.querySelector("#alert-error-https");
    //   alert.style.display = "block";
    //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    //   return;
    // }

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {

    };

     web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

    console.log("Web3Modal instance is", web3Modal);
  }






  /**
   * Fetch account data for UI when
   * - User switches accounts in wallet
   * - User switches networks in wallet
   * - User connects wallet initially
   */
  async function refreshAccountData() {

    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data
    // document.querySelector("#connected").style.display = "none";
    // document.querySelector("#prepare").style.display = "block";

    // Disable button while UI is loading.
    // fetchAccountData() will take a while as it communicates
    // with Ethereum node via JSON-RPC and loads chain data
    // over an API call.
    // document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    await fetchAccountData(provider);
    // document.querySelector("#btn-connect").removeAttribute("disabled")
  }


  /**
   * Connect wallet button pressed.
   */
  async function onConnect() {

    console.log("Opening a dialog", web3Modal);
    try {
      provider = await web3Modal.connect();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
      fetchAccountData();
    });

    await refreshAccountData();
  }

  /**
   * Disconnect wallet button pressed.
   */
  async function onDisconnect() {

    console.log("Killing the wallet connection", provider);

    // TODO: Which providers have close method?
    if(provider.close) {
      await provider.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await web3Modal.clearCachedProvider();
      provider = null;
    }

    selectedAccount = null;
}

 /**
   * Kick in the UI action after Web3modal dialog has chosen a provider
   */
   async function fetchAccountData() {

    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);

    console.log("Web3 instance is", web3);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    const chainData = evmChains.getChain(chainId);
    // document.querySelector("#network-name").textContent = chainData.name;

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
    selectedAccount = accounts[0];
    $("#myInput").val(selectedAccount); 
    // $("#reflink").text(URL+"bgvPreSale/?refer="+selectedAccount); 
    $("#copyClipboard").val(URL+"buymmi/?refer="+selectedAccount);
    $("#connect").text(selectedAccount); 
    let wei_balance = await web3.eth.getBalance(selectedAccount);
    let eth_balance = web3.utils.fromWei(wei_balance);
    
    if(isNaN(eth_balance)){
        eth_balance = 0;
    }
    $("#wallet-balance").text(eth_balance); 
    $.post(URL+"registration/cust_signup",{wallet:selectedAccount});
    mytransactions(selectedAccount);
    myTokenInfo();
    // document.querySelector("#selected-account").textContent = selectedAccount;

    // Get a handl
    // const template = document.querySelector("#template-balance");
    // const accountContainer = document.querySelector("#accounts");

    // Purge UI elements any previously loaded accounts
    // accountContainer.innerHTML = '';

    // Go through all accounts and get their ETH balance
    const rowResolvers = accounts.map(async (address) => {
      const balance = await web3.eth.getBalance(address);
      // ethBalance is a BigNumber instance
      // https://github.com/indutny/bn.js/
      const ethBalance = web3.utils.fromWei(balance, "ether");
      const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
      // Fill in the templated row and put in the document
    //   const clone = template.content.cloneNode(true);
    //   clone.querySelector(".address").textContent = address;
    //   clone.querySelector(".balance").textContent = humanFriendlyBalance;
    //   accountContainer.appendChild(clone);
    });

    // Because rendering account does its own RPC commucation
    // with Ethereum node, we do not want to display any results
    // until data for all accounts is loaded
    await Promise.all(rowResolvers);

    // Display fully loaded UI for wallet data
    // document.querySelector("#prepare").style.display = "none";
    // document.querySelector("#connected").style.display = "block";
  }
  



function copyTextToClipboard(text,success,error) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        Swal.fire({
            type: 'success',
            title: success,
            html: `<div>
            			<p>Please share this link.</p>
                   </div>`
        });
    } catch (err) {
        Swal.fire({
            type: 'error',
            title: error,
            html: `<div>
            			<p>Please try again after refresh.</p>
                   </div>`
        });
    }

  document.body.removeChild(textArea);
}


function myTokenInfo(){
    (async ()=>{
        if(window.ethereum){
            //clearInterval(obj);
            let web3 = new Web3( await web3Modal.connect());

            let chainId = await web3.eth.getChainId();
            let accounts = await web3.eth.getAccounts();


            console.log("Got accounts", accounts);
            selectedAccount = accounts[0];
            let sender = selectedAccount;
           
            
            let wei_balance = await web3.eth.getBalance(sender);
            //let eth_balance = web3.utils.fromWei(wei);
            if(isNaN(wei_balance)){
                wei_balance = 0;
            }
            let smartcontract = new web3.eth.Contract(TOKEN_ABI,TOKEN_ADDRESS,{from:sender});
            let balance = await smartcontract.methods.balanceOf(sender).call();
            //alert(balance);
            let decimals = await smartcontract.methods.decimals().call();
             //balance = balance * Math.pow(10, decimals);
            balance = web3.utils.fromWei(balance); 
            //alert(balance);
            $("#wallet-balance-token").text(balance);
            let presalecontract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS,{from:sender});
            let balancesheet = await presalecontract.methods.getBalanceSheet().call();
            let tokensold = balancesheet.contractTokenSold/1e18;;
            //alert(tokensold);
            $.post(URL+"token/updatecontractinfo",{sold:tokensold}).done(function(data){
                let js = JSON.parse(data);
                var pertage = parseFloat(js.sold)/parseFloat(js.supply)*100;
              $("#pgtoken").css("width", pertage.toFixed(2)+"%");
              $("#val_progreesBar").html(pertage.toFixed(2)+"%");
                $("#sold").text(js.sold);
            });
        }
    })();
}

function mytransactions(selectedAccount){
    $.get(URL+"token/tranxinfo/"+selectedAccount, function(data){
        $("tbody").html(data);
        
    })
}



$("#bnb").on("input",function(){
    var eth_amt = $(this).val();
    let coin = $("#coin").val();
    //alert(eth_amt);return false;
    $.get(URL+"token/exchange/"+eth_amt, function(data){
        $("#coin").val(data);
    })
})


$("#coin").on("input",function(){
    var coin = $(this).val();
    let eth_amt = $("#bnb").val();
    $.get(URL+"token/exchange2/"+coin, function(data){
        $("#bnb").val(data);
    })
})



$("#buy").on("click", function(){
    if(window.ethereum){
        let referel = $("#referer").val();
        
        var eth_amt = $("#bnb").val();
        if(eth_amt<0.05 || eth_amt>7){
            Swal.fire({
                type: 'error',
                title: "Investment between 0.05 BNB and 7 bnb only.",
                allowOutsideClick: false
            })
            return false;
        }    
        (async ()=>{
            
            if(window.ethereum){
                let web3 = new Web3(provider);

                let chainId = await web3.eth.getChainId();
                let accounts = await web3.eth.getAccounts();


                console.log("Got accounts", accounts);
                selectedAccount = accounts[0];
                let sender = selectedAccount;
                var wei = web3.utils.toWei(eth_amt.toString());
                
                let wei_balance = await web3.eth.getBalance(sender);
                let eth_balance = web3.utils.fromWei(wei);
                if(isNaN(eth_balance)){
                    eth_balance = 0;
                }
                let tokencontract = new web3.eth.Contract(TOKEN_ABI,TOKEN_ADDRESS,{from:sender});
                let contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS,{from:sender});
                let balance = await tokencontract.methods.balanceOf(sender).call();
                let decimals = await tokencontract.methods.decimals().call();
                
                if(selectedAccount==referel){
                    Swal.fire({
                        type: 'error',
                        title: "Your Referal must be not be you.",
                        allowOutsideClick: false
                    })
                    return false;
                }
                $.get(URL+"token/contract_info",function(isLive){
                    //alert(isLive);return false;
                    if(isLive>0){
                        if(referel!=null && referel!=undefined && referel!=""){
                            contract.methods.buyWithReferral(referel).send({
                                value : wei,
                                chain_id : CHAIN_ID
                            }).on('transactionHash', function (hash) {
                                console.log('\n[TRANSACTION_HASH]\n\n' + hash);
                                $.post(URL+"token/buy_token",{txn:hash,sender:sender,ether:eth_amt,referer:referel}).done(function(data){
                                    if(data==1){
                                        toastr.success("Transaction done successfully. !");
                                        toastr.info(hash);
                                        Swal.fire({
                                            type: 'success',
                                            title: "Transaction done successfully.",
                                            html: `<div>
                                    			<p>Please wait for confirmation.</p>
                                                <p>If transaction success, SPC will be credited to your wallet.</p>
                                      		</div>`,
                                            allowOutsideClick: false
                                        })
                                        window.location.href = URL+"token/buy_token";
                                    }
                                    else{
                                        Swal.fire({
                                            type: 'error',
                                            title: "Transaction failed.",
                                            allowOutsideClick: false
                                        })
                                    }
                                    
                                })
                            })
                            .on('error', function (error) {
                                console.log('\n[ERROR]\n\n' +  error.message);
                                let msg = error.message.split(":");
                                toastr.error("Error "+error.code+" : "+msg[1]);
                                
                            })
                        }
                        else{
                            contract.methods.buy().send({
                                value : wei,
                                chain_id : CHAIN_ID
                            }).on('transactionHash', function (hash) {
                                console.log('\n[TRANSACTION_HASH]\n\n' + hash);
                                $.post(URL+"token/buy_token",{txn:hash,sender:sender,ether:eth_amt}).done(function(data){
                                    if(data==1){
                                        toastr.success("Transaction done successfully. !");
                                        toastr.info(hash);
                                    //     Swal.fire({
                                    //         type: 'success',
                                    //         title: "Transaction done successfully.",
                                    //         html: `<div>
                                    // 			<p>Please wait for confirmation.</p>
                                    //             <p>If transaction success, SPC will be credited to your wallet.</p>
                                    //   		</div>`,
                                    //         allowOutsideClick: false
                                    //     })
                                       // window.location.href = URL+"user/promo";
                                      Swal.fire({
                                            type: 'success',
                                            title: "Transaction done successfully.",
                                            allowOutsideClick: false
                                        }).then((result) => {
                                              location.reload();
                                            });
                                    }
                                    else{
                                        Swal.fire({
                                            type: 'error',
                                            title: "Transaction failed.",
                                            allowOutsideClick: false
                                        })
                                    }
                                    
                                })
                            })
                            .on('error', function (error) {
                                console.log('\n[ERROR]\n\n' +  error.message);
                                let msg = error.message.split(":");
                                toastr.error("Error "+error.code+" : "+msg[1]);
                                
                            })
                        }
                    }
                    else{
                        Swal.fire({
                            type: 'error',
                            title: 'Phase is not live.',
                           
                        })
                    }
                })
                    
               
            }
            else{
                Swal.fire({
                    type: 'error',
                    title: 'Transaction is failed.',
                   
                })
            }
        })();
        
    }
});

$("#trade_authorize").on("click", function(){
    
    (async ()=>{
        if(window.ethereum){
            let web3 = new Web3(provider);

            let chainId = await web3.eth.getChainId();
            let accounts = await web3.eth.getAccounts();


            console.log("Got accounts", accounts);
            selectedAccount = accounts[0];
            let address = selectedAccount;
        $.post(URL+"trade/login/checkLoginUser",{sender:address}).done(function(data){
                
            if(data==0){
                Swal.fire({
                    type: 'error',
                    title: 'Please login to your wallet or register first',
                   
                });
                return false;
            }
            else{
                
                window.location.href = URL+"trade/user";
               
            }
        });
        }
    })();
    
});


toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

setTimeout(() => {
    if(window.ethereum){
        init();onConnect();myTokenInfo();
    }
    else{
        Swal.fire({
            type: 'error',
            title: 'Please use Metamask or Trustwallet.',
           
        });
        return false;
    }
    
}, 1e3)       
    
    
