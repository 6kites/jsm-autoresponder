import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import Spinner from '@atlaskit/spinner';
import { Box, Flex, Stack, xcss } from '@atlaskit/primitives';
import LoadingButton from '@atlaskit/button/loading-button';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import AutoresponseSettings from './components/AutoresponseSettings';
import PromptSettings from './components/PromptSettings';
import PrivacySettings from './components/PrivacySettings';

// eslint-disable-next-line react/prop-types
const Panel = ({ children, testId }) => (
  <div style={{ marginTop: '20px' }} data-testid={testId}>
    {children}
  </div>
);

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoresponseSettings, setAutoresponseSettings] = useState({});
  const [promptSettings, setPromptSettings] = useState({});
  const [privacySettings, setPrivacySettings] = useState({});

  const handleFetchSuccess = (fetchedData) => {
    setData(fetchedData);
    if (!fetchedData) {
      throw new Error('No data returned');
    }
  };

  const handleFetchError = () => {
    console.error('Failed to get data');
  };

  useEffect(() => {
    invoke('getProjectSettings')
      .then(handleFetchSuccess)
      .catch(handleFetchError);
  }, []);

  function saveSettings() {
    setIsLoading(true);

    const settings = {
      ...data,
      ...autoresponseSettings,
      ...promptSettings,
      ...privacySettings,
    };
    console.log({ settings });
    const setProjectSettings = async () =>
      invoke('setProjectSettings', { ...settings });
    setProjectSettings().then(() => {
      setIsLoading(false);
    });
  }

  if (!data) {
    return <Spinner interactionName="load" />;
  }

  return (
    <Box style={{ width: '700px' }}>
      <Stack space="space.600">
        <Box>
          <Tabs>
            <TabList>
              <Tab>Autoresponse</Tab>
              <Tab>Prompt</Tab>
              <Tab>Privacy</Tab>
            </TabList>
            <TabPanel>
              <Panel>
                <AutoresponseSettings
                  settingsData={data}
                  setAutoresponseSettings={setAutoresponseSettings}
                />
              </Panel>
            </TabPanel>
            <TabPanel>
              <Panel>
                <PromptSettings
                  settingsData={data}
                  setPromptSettings={setPromptSettings}
                />
              </Panel>
            </TabPanel>
            <TabPanel>
              <Panel>
                <PrivacySettings
                  settingsData={data}
                  setPrivacySettings={setPrivacySettings}
                />
              </Panel>
            </TabPanel>
          </Tabs>
        </Box>

        <Box xcss={xcss({ paddingLeft: 'space.100' })}>
          <Flex justifyContent="start">
            <LoadingButton
              isLoading={isLoading}
              appearance="primary"
              onClick={saveSettings}>
              Save Settings
            </LoadingButton>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
}

export default App;
