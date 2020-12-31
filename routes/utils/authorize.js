"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const github = async function (params,model) {
  if (params.code) {
    const { access_token } = await authenticate({ params });
    const { login,email } = await getUsername({ access_token });
    const {token} = await checkUsername({
      username: login,
      model,
      email,
      access_token,
      token_pass: params.token_pass,
    });
    
    if(token){
      return  {
        headers: { location: `${params.frontend_url}/callback/?token=${token}` },
        statusCode: 302
        };
    }else{
      return  {
        headers: { location: params.frontend_url },
        statusCode: 302
        };
    }
    
  } else {
    return {
      headers: { location: `${params.frontend_url}/login` },
      statusCode: 302
      };
  }
};
module.exports.github = github;
async function authenticate({ params }) {
  const { data } = await axios({
    url: "https://github.com/login/oauth/access_token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    data: formUrlEncoded({
      client_id: params.github_client_id,
      client_secret: params.github_client_secret,
      code: params.code,
    }),
    method: "POST",
  });
  return data;
}
async function getUsername({ access_token }) {
  const { data } = await axios({
    url: " https://api.github.com/user",
    headers: {
      Authorization: `token ${access_token}`,
      Accept: "application/vnd.github.v3+json",
    },
    method: "GET",
  });
  return data;
}
async function checkUsername({ username, access_token, model, email,token_pass }) {
  const token = jwt.sign({ access_token }, token_pass);
  
  const [user,created] =await model.user.findOrCreate({where: {username}, defaults: {access_token,
    token,
    email}})
  if (user) {
    const updated=await user.update({access_token,
      token,
      email})
     return updated ? {token}:undefined;
  } else {
    return created ? {token}:undefined;
    
  }
}

