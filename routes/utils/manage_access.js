"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const paypal = require("@paypal/checkout-server-sdk");
const buy_paypal = async function (params,model) {
  const random = makeid(5);
    
  const query = {
    selector: {
      $and: [
        { _id: { $eq: params._id } },
        { collection: { $eq: "private-repo" } },
      ],
    },
  };

  const res = await db.find(query);
  const repo= await model.for_sell.findOne({where:{repo_id:params.id}})
  const paypalEmail= await model.paypal.findOne({where:{github_username:repo.username}})
    
  let clientId = params.paypal_client_id;
  let clientSecret = params.paypal_client_secret;
  let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  let client = new paypal.core.PayPalHttpClient(environment);
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: repo.amount,
        },
        payee: {
          email_address: paypalEmail.email,
        },
      },
    ],

    application_context: {
      return_url: `${params.return_url}/${params.token}/${params.id}/${random}`,
      cancel_url: params.cancel_url,
    },
  });

  let response = await client.execute(request);
  const _transaction=await model.transaction.findOrCreate({where:{random},defaults:{for_sell_id: response.result.id,
    token: params.token}})
    _transaction.for_sell_id=response.result.id
    _transaction.token=params.token
    await _transaction.save()
  return response;
};
const manage_access = async function (params,model) {
  const { token,id,random } = params;
  const { access_token } = jwt.verify(token, params.token_pass);
  const res=await model.user.findOne({where:{access_token}})
  if (res) {
    const transaction=await model.transaction.findOne({where:{random,token}})
    let clientId = params.paypal_client_id;
    let clientSecret = params.paypal_client_secret;
    let environment = new paypal.core.SandboxEnvironment(
      clientId,
      clientSecret
    );
    let client = new paypal.core.PayPalHttpClient(environment);
    const request = new paypal.orders.OrdersCaptureRequest(transaction.for_sell_id);
    request.requestBody({});
    let response = await client.execute(request);

    await transaction.destroy();
    
const privateRepo=await model.for_sell.findOne({where:{repo_id:id}})
    const repoOwner=await model.user.findOne({where:{username:privateRepo.username }})
    const paypalAcc=await model.paypal.findOne({where:{github_username:privateRepo.username }})
    const { data, status } = await axios({
      url: `https://api.github.com/repos/${privateRepo.username}/${privateRepo.name}/collaborators/${res.username}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `bearer ${repoOwner.access_token}`,
      },
      data: {
        permission: "pull",
      },
      method: "PUT",
    });
    
    if (status === 201) {
      let paypal = paypalAcc;
      let amount = Number(paypal.amount);
      amount += Number(privateRepo.amount);
      paypal.amount = amount;
      await paypal.save();
      const {  username,repo_id, ...other } = privateRepo;
      const [owned,created]=await model.owned_repo.findOrCreate({where:{repo_id},defaults:{
        ...other,
        owner_username: username,
        username: res.username
      }})
      const selectOwnedRepo={selector:{
        ...other,
        owner_username: username,
        collection: "owned-repo",
        username: res.username,
      }}
      
      if (created) {
        return {
          headers: { location: `${params.frontend_url}/dashboard` },
          statusCode: 302,
        };
        
      } else {
        return {
          headers: { location: `${params.frontend_url}/dashboard?error` },
          statusCode: 302,
        };
      
      }
    } else {
      
      return {
        headers: { location: `${params.frontend_url}/dashboard?error` },
        statusCode: 302,
      };
    }
  }
};
module.exports.buy_paypal = buy_paypal;
module.exports.manage_access = manage_access;
