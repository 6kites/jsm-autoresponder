import Resolver from '@forge/resolver';
import api, { route, properties, storage } from '@forge/api';
import { ISSUE_PROPERTY_KEY } from '../utils';

const resolver = new Resolver();

resolver.define("getProjectSettings", async (req) => {
  const { project } = req.context.extension
  const enabledAutoresponse = await properties.onJiraProject(project.key).get(ISSUE_PROPERTY_KEY.default)
  return enabledAutoresponse
});

resolver.define("setProjectSettings", async (req) => {
  const { payload } = req
  const { project } = req.context.extension
  await properties.onJiraProject(project.key).set(ISSUE_PROPERTY_KEY.default, payload)
});


export const projectSettingsHandler = resolver.getDefinitions();
