"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const authorize_paypal = async function (params) {
   if (params.code) {
    const { access_token } = await authenticate({ params });
    const { emails } = await getEmail({ access_token });
    

    if (emails) {
      return {
        headers: { location: `${params.frontend_url}/callback/?email=${emails[0].value}` },
        statusCode: 302,
      };
    } else {
      return {
        headers: { location: `${params.frontend_url}/dashboard` },
        statusCode: 302,
      };
    }
  } else {
    return {
      headers: { location: `${params.frontend_url}/login` },
      statusCode: 302,
    };
  }
};

async function authenticate({ params }) {
  const { data } = await axios({
    url: "https://api.sandbox.paypal.com/v1/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${params.paypal_client_id}:${params.paypal_client_secret}`
      ).toString("base64")}`,
    },
    data: formUrlEncoded({
      grant_type: "authorization_code",
      code: params.code,
    }),
    method: "POST",
  });
  return data;
}
async function getEmail({ access_token }) {
  const { data } = await axios({
    url:
      "https://api.sandbox.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return data;
}
const save_paypal=async function(params,model){

  const ok=await saveEmail({model,token_pass:params.token_pass,token:params.token,email:params.email})
  if(ok){
    return {status:true,message:"email saved"}
  }else{
    return {status:false,message:"email not saved"}
  }
}
async function saveEmail({ token_pass,token, model, email }) {
  const { access_token } = jwt.verify(token, token_pass);
  const _user=await model.user.findOne({where:{access_token}})
  if (_user) {
    const [_paypal,created]=await model.paypal.findOrCreate({where:{github_username:_user.username},defaults: {
      email,
      amount:0,
      disconnect:false
    }})
    if(!created){
      _paypal.disconnect=false;
      await _paypal.save()
      return true
    }else{
      return created;
    }
    
    
  } else {
    return false
  }
}
const get_paypal=async function(params,model){
  
  const ok=await getPaypal({model,token_pass:params.token_pass,token:params.token})
  if(ok){
    return {status:true,data:ok}
  }else{
    return {status:false,message:"error"}
  }
}
async function getPaypal({ model, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
   const _user=await model.user.findOne({where:{access_token}})
  if(_user){
    const _paypal=await model.paypal.findOne({where:{github_username:_user.username}})
    return _paypal;          
  }else{
    return {status:false,data:[],message:"error token"}
  }
  
}
const disconnect_paypal=async function(params,model){

  const ok=await deletePaypal({model,token_pass:params.token_pass,token:params.token})
  if(ok){
    return {status:true,data:ok}
  }else{
    return {status:false,message:"error"}
  }
}
async function deletePaypal({ model, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const _user=await model.user.findOne({where:{access_token}})
  
await model.for_sell.update({
sell: "UNLIST",
}, {
  where: {
    username:_user.username
  }
});
  
  if(_user){
    const _paypal=await model.paypal.findOne({where:{github_username:_user.username}})
    _paypal.disconnect=true;
    _paypal.save()
    return {status:true,message:"success"}
          
  }else{
    return {status:false,data:[],message:"error token"}
  }
  
}
module.exports.authorize_paypal = authorize_paypal;
module.exports.save_paypal = save_paypal;
module.exports.get_paypal = get_paypal;
module.exports.disconnect_paypal = disconnect_paypal;
