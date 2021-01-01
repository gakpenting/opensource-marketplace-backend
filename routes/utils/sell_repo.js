const axios = require("axios");
const jwt = require("jsonwebtoken");
const sell_repo = async function (params,model) {
    
  
    const data = await sellRepo({
      model,
      token: params.token,
      token_pass: params.token_pass,
      name:params.name,
      amount:params.amount
      
    });
  
    if (data && data.length>0) {
      return {
        data
      };
    } else {
      return {
        data,
      };
    }
  };
  const list_repo = async function (params,model) {
    
  
    const data = await listRepo({
      model,
      token: params.token,
      token_pass: params.token_pass,
      item:params.item,
      
      
    });
  
    if (data && data.length>0) {
      return {
        data
      };
    } else {
      return {
        data,
      };
    }
  };
  const unlist_repo = async function (params,model) { 
  
    const data = await unlistRepo({
      model,
      token: params.token,
      token_pass: params.token_pass,
      id:params.id,
      
    });
  
    if (data && data.length>0) {
      return {
        data
      };
    } else {
      return {
        data,
      };
    }
  };
  const for_sale_repo = async function (params,model) {
   
  
    const data = await forSaleRepo({
      model,
      token: params.token,
      token_pass: params.token_pass,
    });
  
    if (data && data.data.length>0) {
      return {
        data
      };
    } else {
      return {
        data,
      };
    }
  };
  async function repo_detail(params,model){
return (await model.for_sell.findOne({where:{username:params.username,name:params.name}}))
  }
  async function getRepoDetail({_user, name}) {
      if (_user) {
      const { data } = await axios({
        url: "https://api.github.com/graphql",
        headers: {
          Authorization: `token ${_user.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
        method: "POST",
        data: {
          query: `{repository(name:"${name}",owner:"${_user.username}"){
            description
                           name
                           openGraphImageUrl
                           url
                           id
                           isPrivate
         }}
        `,
        },
      });
      const repository = data.data.repository
      return repository;
    } else {
  
      return undefined;
    }
  }
  async function sellRepo({ model, token_pass, token,name,amount}) {
    const { access_token } = jwt.verify(token, token_pass);
      const _user=await model.user.findOne({where:{access_token}})    
    if(_user){
      let repo = await getRepoDetail({_user,name})
      if(repo){
        const {id,...repoDetail}=repo;
        const [_repo, created] = await model.for_sell.findOrCreate({
          where: { repo_id: repo.id },
          defaults: {
            ...repoDetail,
            sell:"SELL",
            amount:amount
          }
        });
        const updated=await _repo.update({...repoDetail,
          sell:"SELL",
          amount:amount})
        if(updated||created){
          const forSale=await model.for_sell.findAll({where:{username:_user.username}})
          return forSale
        }else{
          return {status:false,data:[],message:"error selling"}  
        }
        
      }else{
        return {status:false,data:[],message:"error selling"}
      }
      
    }else{
      return {status:false,data:[],message:"error token"}
    }
    
  }
  async function listRepo({ model, token_pass, token,item }) {
    const { access_token } = jwt.verify(token, token_pass);
    const _user=await model.user.findOne({where:{access_token}})
    if(_user){
      const {id,...other}=item
      const [repo,created]=await model.for_sell.findOrCreate({where:{repo_id:id},defaults:{
...other,
sell:"UNLIST",
amount:0,
username:_user.username
      }})
     if(repo){
       const updated=await repo.update({...other,sell:"UNLIST",amount:0,username:_user.username})
       if(created||updated){
        const repoAll=await model.for_sell.findAll({where:{username:_user.username}})
         return repoAll
     }else{
       return {status:false,data:[],message:"error list"}
     }
     }
      
      
    }else{
      return {status:false,data:[],message:"error token"}
    }
    
  }
  async function unlistRepo({ model, token_pass, token,id }) {
    const { access_token } = jwt.verify(token, token_pass);
    const _user=await model.user.findOne({where:{access_token}})
    if(_user){
      const repo=await model.for_sell.findOne({where:{repo_id:id}})
      if(repo){
        repo.sell="UNLIST";
        await repo.save()
        const repoAll=await model.for_sell.findAll({where:{username:_user.username}})
        return repoAll
      }else{
        return {status:false,data:[],message:"error unlist"}
      }
      
    }else{
      return {status:false,data:[],message:"error token"}
    }
    
  }
  async function forSaleRepo({ model, token_pass, token }) {
    let _user;
    if(token){
      const { access_token } = jwt.verify(token, token_pass);
      _user=await model.user.findOne({where:{access_token}})
    }
    
     const repo = await model.for_sell.findAll({where:{sell:"SELL"}})
      return {username:_user?_user.username:null,data:repo}   
  }
  module.exports.sell_repo = sell_repo;
  module.exports.unlist_repo = unlist_repo;
  module.exports.for_sale_repo = for_sale_repo;
  module.exports.list_repo = list_repo;
  module.exports.repo_detail = repo_detail;