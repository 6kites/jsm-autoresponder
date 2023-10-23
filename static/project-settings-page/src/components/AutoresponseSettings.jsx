import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { token } from '@atlaskit/tokens';
import { Box, Grid, xcss } from '@atlaskit/primitives';
import Checkbox from '@atlaskit/checkbox';
import TextField from '@atlaskit/textfield';
import { TimePicker } from '@atlaskit/datetime-picker';
import Lozenge from '@atlaskit/lozenge';
import Select from '@atlaskit/select';
import { Label } from '@atlaskit/form';
import { generateOptions, generateTimeList } from '../utils';

export default function AutoresponseSettings({
  settingsData,
  setAutoresponseSettings,
}) {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState(settingsData);
  const [isEnabled, setIsEnabled] = useState(data?.autoresponseEnabled);
  const [parentChecked, setParentChecked] = useState(
    !data?.autoresponseEnabled
  );
  const [editResponseEnabled, setEditResponseEnabled] = useState(
    data?.editResponseEnabled
  );
  const [editPromptEnabled, setEditPromptEnabled] = useState(
    data?.editPromptEnabled
  );
  const checkboxGroupStyles = {
    display: 'flex',
    paddingLeft: token('space.300', '24px'),
    flexDirection: 'column',
  };

  const PARENT_AUTORESPONSE = 'Enable Autoresponse';
  const CHILD_EDIT_RESPONSE = 'Enable response edit';
  const CHILD_EDIT_PROMPT = 'Enable prompt edit';

  const timeUnits = generateOptions(['minutes', 'hours', 'days']);

  const onChange = (event) => {
    const { value, checked } = event.target;
    const temp = {
      autoresponseEnabled: isEnabled,
      editResponseEnabled,
      editPromptEnabled,
    };

    if (value === PARENT_AUTORESPONSE) {
      temp.autoresponseEnabled = !isEnabled;
      setIsEnabled(() => !isEnabled);
      setParentChecked(checked);
    } else if (value === CHILD_EDIT_RESPONSE) {
      temp.editResponseEnabled = checked;
      setEditResponseEnabled(checked);
    } else if (value === CHILD_EDIT_PROMPT) {
      temp.editPromptEnabled = checked;
      setEditPromptEnabled(checked);
    }

    setAutoresponseSettings((prev) => ({ ...prev, ...temp }));
  };

  const autoresponseStatus = () => {
    if (isEnabled) return <Lozenge appearance="success">Enabled</Lozenge>;
    else return <Lozenge appearance="removed">Disabled</Lozenge>;
  };

  return (
    <Box>
      <h3 style={{ marginBottom: '10px' }}>Autoresponse Settings</h3>
      <p style={{ marginBottom: '5px' }}>
        Autoresponse: {autoresponseStatus()}
      </p>
      <Checkbox
        isChecked={parentChecked}
        // isIndeterminate={getIsParentIndeterminate(checkedItems)}
        label="Require human agent to review AI responses prior to sending to customer"
        onChange={onChange}
        value={PARENT_AUTORESPONSE}
        name={PARENT_AUTORESPONSE}
      />
      <div style={checkboxGroupStyles}>
        <Checkbox
          isChecked={editResponseEnabled}
          onChange={onChange}
          label="Allow agent to edit AI response before sending to customer"
          isDisabled={!parentChecked}
          value={CHILD_EDIT_RESPONSE}
          name={CHILD_EDIT_RESPONSE}
        />
        <Checkbox
          isChecked={editPromptEnabled}
          onChange={onChange}
          label="Allow agent to edit AI prompt to regenerate a new AI response"
          isDisabled={!parentChecked}
          value={CHILD_EDIT_PROMPT}
          name={CHILD_EDIT_PROMPT}
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <Checkbox
          label="Automatically respond to customer requests via AI ONLY during these hours"
          value={'Autoresponse after hours'}
          style={{ marginBottom: '10px' }}
          name="after-hours"
        />
        <Grid
          templateColumns="2fr 2fr"
          columnGap="space.200"
          xcss={xcss({ marginLeft: '30px', marginTop: '5px' })}>
          <div>
            <Label htmlFor="timepicker-editable-time">From</Label>
            <TimePicker
              onChange={(event) => console.log({ event })}
              times={generateTimeList()}
              selectProps={{
                inputId: 'timepicker-editable-time',
              }}
            />
          </div>
          <div>
            <Label htmlFor="timepicker-editable-time">To</Label>
            <TimePicker
              times={generateTimeList()}
              selectProps={{
                inputId: 'timepicker-editable-time',
              }}
            />
          </div>
        </Grid>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Checkbox
          label="Automatically respond to customer requests via AI if an agent has not responded within"
          value={'Autoresponse within'}
          name="within"
        />
        <Grid
          templateColumns="2fr 2fr"
          columnGap="space.200"
          xcss={xcss({ marginLeft: '30px', marginTop: '5px' })}>
          <TextField id="timeDigit" min={1} type="number" />
          <Select options={timeUnits} isClearable />
        </Grid>
      </div>
    </Box>
  );
}

AutoresponseSettings.propTypes = {
  settingsData: PropTypes.object,
  setAutoresponseSettings: PropTypes.func,
};
