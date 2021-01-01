require("dotenv").config();
const express = require("express");
const router = express.Router();
const model = require("../models/index");
const { github: authorizeGithub } = require("./utils/authorize");
const {
  forSellRepo,
  allRepo,
  ownedRepo,
  profile,
  
} = require("./utils/for_sale");
const { sell_repo, unlist_repo, for_sale_repo, list_repo,repo_detail} = require("./utils/sell_repo");
const {
  authorize_paypal,
  save_paypal,
  get_paypal,
  disconnect_paypal,
} = require("./utils/paypal");
const { buy_paypal, manage_access } = require("./utils/manage_access");

router.get("/authorize_github", async function (req, res, next) {
  const params = {};
  params.code = req.query.code;
  params.token_pass = process.env.token_pass;
  params.frontend_url = process.env.frontend_url;
  params.github_client_id = process.env.github_client_id;
  params.github_client_secret = process.env.github_client_secret;
  const response = await authorizeGithub(params, model);
  return res.redirect(response.headers.location);
});
router.get("/get-for-sale-repo", async function (req, res, next) {
  try {
    const params = {};
    params.token = req.query.token;
    params.token_pass = process.env.token_pass;
    params.frontend_url = process.env.frontend_url;
    params.github_client_id = process.env.github_client_id;
    params.github_client_secret = process.env.github_client_secret;
    const response = await forSellRepo(params, model);
    return res.json(response);
  } catch (e) {
    console.log(e.message);
    return res.status(503).end();
  }
});
router.get("/get-all-repo", async function (req, res, next) {
  try {
    const params = {};
    params.token_pass = process.env.token_pass;
    params.frontend_url = process.env.frontend_url;
    params.github_client_id = process.env.github_client_id;
    params.github_client_secret = process.env.github_client_secret;
    params.before = req.query.before;
    params.after = req.query.after;
    params.token = req.query.token;
    const response = await allRepo(params, model);
    return res.json(response);
  } catch (e) {
    console.log(e.message);
    return res.status(503).end();
  }
});
router.get("/get-owned-repo", async function (req, res, next) {
  try {
    const params = {};
    params.token_pass = process.env.token_pass;
    params.token = req.query.token;
    params.frontend_url = process.env.frontend_url;
     const response = await ownedRepo(params, model);
    return res.json(response);
  } catch (e) {
    console.log(e.message);
    return res.status(503).end();
  }
});
router.get("/get-profile", async function (req, res, next) {
  const params = {};
  params.token_pass = process.env.token_pass;
  params.frontend_url = process.env.frontend_url;
  params.github_client_id = process.env.github_client_id;
  params.github_client_secret = process.env.github_client_secret;
  params.token = req.query.token;
  const response = await profile(params, model);
  return res.json(response);
});
router.post("/sell-repo", async function (req, res, next) {
  const params = {};
  params.name = req.body.name;
  params.amount = req.body.amount;
  params.token = req.query.token;
  params.token_pass = process.env.token_pass;
  params.frontend_url = process.env.frontend_url;
  params.github_client_id = process.env.github_client_id;
  params.github_client_secret = process.env.github_client_secret;
  const response = await sell_repo(params, model);
  return res.json(response);
});
router.post("/unlist-repo", async function (req, res, next) {
  const params = {};
  params.id = req.body.id;
  params.token = req.query.token;
  params.token_pass = process.env.token_pass;
  params.frontend_url = process.env.frontend_url;
  params.github_client_id = process.env.github_client_id;
  params.github_client_secret = process.env.github_client_secret;
  const response = await unlist_repo(params, model);
  return res.json(response);
});
router.get("/for-sale-repo", async function (req, res, next) {
  try {
    const params = {};
    params.token = req.query.token;
    params.token_pass = process.env.token_pass;
    params.frontend_url = process.env.frontend_url;
    params.github_client_id = process.env.github_client_id;
    params.github_client_secret = process.env.github_client_secret;
    const response = await for_sale_repo(params, model);
    return res.json(response);
  } catch (e) {
    console.log(e.message);
    return res.status(503).end();
  }
});
router.get("/paypal-auth", async function (req, res, next) {
  try {
    const params = {};
    params.code = req.query.code;
    params.frontend_url = process.env.frontend_url;
    params.paypal_client_id = process.env.paypal_client_id;
    params.paypal_client_secret = process.env.paypal_client_secret;
    const response = await authorize_paypal(params);
    return res.redirect(response.headers.location);
  } catch (e) {
    console.log(e.message);
    return res.status(503).end();
  }
});
router.post("/save-paypal", async function (req, res, next) {
  try {
    const params = {};
    params.token_pass = process.env.token_pass;
    params.token = req.body.token;
    params.email = req.body.email;
    const response = await save_paypal(params, model);
    return res.json(response);
  } catch (e) {
    console.log(e.message);
    return res.status(503).end();
  }
});
router.get("/get-paypal", async function (req, res, next) {
  try {
    const params = {};
    params.token_pass = process.env.token_pass;
    params.token = req.query.token;
    params.frontend_url = process.env.frontend_url;
    const response = await get_paypal(params, model);
    return res.json(response);
  } catch (e) {
    console.log(e.message);
    return res.status(503).end();
  }
});
router.post("/disconnect-paypal", async function (req, res, next) {
  const params = {};
  params.token_pass = process.env.token_pass;
  params.token = req.query.token;
  params.frontend_url = process.env.frontend_url;
  const response = await disconnect_paypal(params, model);
  return res.json(response);
});
router.post("/buy-paypal", async function (req, res, next) {
  const params = {};
  params.token_pass = process.env.token_pass;
  params.token = req.body.token;
  params.id = req.body.id;
  params.frontend_url = process.env.frontend_url;
  params.return_url = process.env.return_url;
  params.cancel_url = process.env.cancel_url;
  params.paypal_client_id = process.env.paypal_client_id;
  params.paypal_client_secret = process.env.paypal_client_secret;
  const response = await buy_paypal(params, model);
  return res.json(response);
});
router.post("/repo-detail", async function (req, res, next) {
  const params = {};
  params.name=req.body.name
  params.username=req.body.username
  const response = await repo_detail(params, model);
  return res.json(response);
});
router.get(
  "/manage-access/:token/:id/:random",
  async function (req, res, next) {
    const params = {};
    params.token_pass = process.env.token_pass;
    params.token = req.params.token;
    params.id = req.params.id;
    params.random = req.params.random;
    params.frontend_url = process.env.frontend_url;
    params.paypal_client_id = process.env.paypal_client_id;
    params.paypal_client_secret = process.env.paypal_client_secret;
    const response = await manage_access(params, model);
    return res.redirect(response.headers.location);
  }
);
router.post("/list-repo", async function (req, res, next) {
  try{
    const params = {};
  params.item = req.body.item;
  params.token = req.query.token;
  params.token_pass = process.env.token_pass;
  const response = await list_repo(params, model);
  return res.json(response);
  }catch(e){
    console.log(e.message)
    return res.status(503).end()
  }
  
});
router.get("/", async function (req, res, next) {
  return res.send("im healthy");
});
module.exports = router;
