import Resolver from '@forge/resolver';
import api, { route, properties, storage } from '@forge/api';
import { addComment, callChatGPT, getIssueDetails, getIssueProperty, issuePropertyKey, getProjects } from '../utils';
const resolver = new Resolver();

resolver.define("getAdminProperties", async (req) => {
  console.log("admin req", req);
  let url = await storage.get('url');
  let apiToken = await storage.getSecret('apiToken');
  let tokenIsSet = apiToken!== undefined && apiToken !== "";
  // We don't actually want to send the password back to the front end
  return {"url":url || "", "apiTokenIsSet": tokenIsSet}
});

resolver.define("setAdminProperties", async (req) =>{
  if (req.payload.url != undefined) {
      let url = req.payload.url;
      storage.set('url',url)
  }
  if (req.payload.apiToken !== undefined) {
      let apiToken = req.payload.apiToken;
      storage.setSecret('apiToken', apiToken);
  }
  //console.log(req.payload.apiToken);
});

resolver.define("getProjects", async (req) => {
  const { payload } = req
  const projects = await getProjects()
  return projects
});


export const adminHandler = resolver.getDefinitions();
