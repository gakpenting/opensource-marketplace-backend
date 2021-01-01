"use strict";
const axios = require("axios");
const jwt = require("jsonwebtoken");
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
const allRepo = async function (params,model) {
  const data = await getAllRepo({
    model,
    token: params.token,
    token_pass: params.token_pass,
    before:params.before,
    after:params.after,
  });

  if (data&&data.nodes.length>0) {
    return {
      data,
    };
  } else {
    return {
      data: [],
    };
  }
};
const forSellRepo = async function (params,model) {
  const data = await getForSellRepo({
    model,
    token: params.token,
    token_pass: params.token_pass,
  });

  if (data&&data.length>0) {
    return {
      data,
    };
  } else {
    return {
      data: [],
    };
  }
};
const ownedRepo = async function (params,model) {
  const data = await getOwnedRepo({
    model,
    token: params.token,
    token_pass: params.token_pass,
  });

  if (data&&data.length>0) {
    return {
      data,
    };
  } else {
    return {
      data: [],
    };
  }
};

const profile = async function (params,model) {
  const data = await getProfile({
    model,
    token: params.token,
    token_pass: params.token_pass,
  });

  if (data) {
    return {
      data: data.data.viewer,
    };
  } else {
    return {
      data: {},
    };
  }
};

async function getProfile({ model, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const _user=await model.user.findOne({where:{access_token}})
  
  if (_user) {
    const { data } = await axios({
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `token ${_user.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
      method: "POST",
      data: { query: "query { viewer { login,avatarUrl }}" },
    });
    return data;
  } else {
    return null;
  }
}

async function getAllRepo({ model, token_pass, token ,before,after}) {
  const { access_token } = jwt.verify(token, token_pass);
  const _user=await model.user.findOne({where:{access_token}})
  if (_user) {
    const { data } = await axios({
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `token ${_user.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
      method: "POST",
      data: {
        query: `{
          repositoryOwner(login: "${_user.username}") {
            repositories(${before||after?before?"last:5,":after?"first:5,":"":"first:5,"}${before?"before:\""+before+"\",":""}${after?"after:\""+after+"\",":""}affiliations:OWNER) {
           pageInfo {
        startCursor
        hasNextPage
        hasPreviousPage
        endCursor
      }
              nodes {
                isPrivate
                description
                name
                openGraphImageUrl
                url
                id
              }
            }
          }
        }
      `,
      },
    });
   
    const nodes = data.data.repositoryOwner.repositories;
    return nodes;
  } else {

    return [];
  }
}
async function getForSellRepo({ model, token_pass, token }) {
  const { access_token } = jwt.verify(token, token_pass);
  const _user=await model.user.findOne({where:{access_token}})
  
  if(_user){
    const {username}=_user;
    const forSell=await model.for_sell.findAll({where:{username}})
    return forSell;
  }else{
    return []
  }
  
}
async function getOwnedRepo({ model, token_pass, token }) {
  let _user
  if(token){
    const { access_token } = jwt.verify(token, token_pass);
   _user=await model.user.findOne({where:{access_token}})
  }
  
  if(_user){
    const {username}=_user;
    const ownedRepo=await model.owned_repo.findAll({where:{username}})
    return ownedRepo;
  }else{
    return []
  }
  
}
module.exports.profile = profile;
module.exports.forSellRepo = forSellRepo;
module.exports.ownedRepo = ownedRepo;
module.exports.allRepo = allRepo;