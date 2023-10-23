import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@atlaskit/primitives';
import Checkbox from '@atlaskit/checkbox';

export default function PrivacySettings({ settingsData, setPrivacySettings }) {
  const [redactEnabled, setRedactEnabled] = useState(
    settingsData?.redactEnabled || false
  );
  const [skipResponsesEnabled, setSkipResponsesEnabled] = useState(
    settingsData?.skipResponsesEnabled || false
  );
  const REDACT = 'Redact';
  const SKIP_RESPONSES = 'Skip Responses';

  const onChange = (e) => {
    const { name, checked } = e.target;
    const temp = { redactEnabled, skipResponsesEnabled };

    if (name === REDACT) {
      setRedactEnabled(checked);
      temp.redactEnabled = checked;
    } else if (name === SKIP_RESPONSES) {
      setSkipResponsesEnabled(checked);
      temp.skipResponsesEnabled = checked;
    }

    setPrivacySettings((prev) => ({ ...prev, ...temp }));
  };

  return (
    <Box>
      <h3 style={{ marginBottom: '10px' }}>Privacy Settings</h3>
      <Checkbox
        isChecked={redactEnabled}
        onChange={onChange}
        label="Identify private information/content and replace/redact from the prompt and/or response"
        value={REDACT}
        name={REDACT}
      />
      <Checkbox
        isChecked={skipResponsesEnabled}
        onChange={onChange}
        label="Identify private information/content and skip AI generated responses if private content detected"
        value={SKIP_RESPONSES}
        name={SKIP_RESPONSES}
      />
    </Box>
  );
}

PrivacySettings.propTypes = {
  settingsData: PropTypes.object,
  setPrivacySettings: PropTypes.func,
};
