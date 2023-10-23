import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Stack, xcss } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import Button from '@atlaskit/button/standard-button';
import Tag from '@atlaskit/tag';
import Select from '@atlaskit/select';
import Form, { Field, FormHeader, FormSection, Label } from '@atlaskit/form';
import { generateOptions } from '../utils';

// eslint-disable-next-line no-unused-vars
export default function PromptSettings({ settingsData, setPromptSettings }) {
  const [requestTypes, setRequestTypes] = useState(
    generateOptions([
      'Service Request',
      'Incident',
      'Change Request',
      'Problem',
    ])
  );
  const [selectRequestTypeValue, setSelectRequestTypeValue] = useState();
  const [selectedRequestTypes, setSelectedRequestTypes] = useState([]);

  const [selectRequestTypeForFieldValue, setSelectRequestTypeForFieldValue] =
    useState();

  const [selectRequestFieldValue, setSelectRequestFieldValue] = useState();

  // eslint-disable-next-line no-unused-vars
  const [fields, setFields] = useState({
    'Operating System':
      "The operating system the customer's computer is running on",
    Purpose: 'Purpose of the change being requested',
    System: 'System that the change is being requested for',
    Location: 'Location where the user resides',
    'Access Level': 'Access Level being requested',
    'Application Name':
      'The name of the application that the customer is using',
    'Application Version':
      'The version of the application that the customer is using',
  });
  // eslint-disable-next-line no-unused-vars
  const [fieldsOptions, setFieldsOptions] = useState(
    generateOptions(Object.keys(fields))
  );
  const [requestTypeFields, setRequestTypeFields] = useState({
    'Service Request': [
      {
        label: 'Operating System',
        placeholder:
          "The operating system the customer's computer is running on",
      },
      {
        label: 'Application Name',
        placeholder: 'The name of the application that the customer is using',
      },
      {
        label: 'Application Version',
        placeholder:
          'The version of the application that the customer is using',
      },
    ],
    Incident: [
      {
        label: 'Operating System',
        placeholder:
          "The operating system the customer's computer is running on",
      },
    ],
  });
  const [selectedRequestTypeFields, setSelectedRequestTypeFields] = useState(
    []
  );
  // eslint-disable-next-line no-unused-vars
  const [purpose, setPurpose] = useState();

  const onChangePurpose = (event) => {
    const { value } = event.target;
    setPurpose(value);
    setPromptSettings((prev) => ({ ...prev, purpose: value }));
  };

  /* eslint-disable no-unused-vars */
  return (
    <Box>
      <h3>Prompt Settings</h3>
      <p>
        <em>
          The settings in this section will be used to customize the prompt
          submitted to the AI engine to improve the responses that will be
          provided to the customer.
        </em>
      </p>

      <div style={{ marginTop: '10px' }}>
        <Label>Describe the purpose of this service desk</Label>
        <TextArea
          onChange={onChangePurpose}
          placeholder="This is a service desk for the IT team at a software company. The agent is responsible for assessing users with their internal IT needs."
        />
      </div>

      <Form onSubmit={{}}>
        {({ formProps, submitting, reset }) => (
          <form noValidate {...formProps}>
            <FormHeader title=""></FormHeader>
            <FormSection>
              {/* request type selection */}
              <Grid
                templateColumns="3fr 1fr"
                alignItems="end"
                columnGap="space.200"
                justifyItems="stretch">
                <Field
                  name="Request Type Selection"
                  label="Select request types to apply automatic responses for this project"
                  defaultValue={null}
                  // isRequired
                  validate={(value) => {
                    setSelectRequestTypeValue(value);
                  }}>
                  {({ fieldProps: { id, ...rest } }) => {
                    return (
                      <Fragment>
                        <Select
                          inputId={id}
                          {...rest}
                          options={requestTypes}
                          placeholder={'Find/select request type to add'}
                          isSearchable
                          isClearable
                        />
                        {/* {selectHasError && (
                          <ErrorMessage>{errorMessages.selectError}</ErrorMessage>
                        )} */}
                      </Fragment>
                    );
                  }}
                </Field>

                <div>
                  <Button
                    appearance="link"
                    isDisabled={requestTypes.length === 0}
                    onClick={(event) => {
                      if (!selectRequestTypeValue) return;
                      setSelectedRequestTypes((prev) => [
                        ...prev,
                        selectRequestTypeValue,
                      ]);
                      setRequestTypes((prev) =>
                        prev.filter(
                          (proj) => proj.value !== selectRequestTypeValue.value
                        )
                      );
                      reset();
                    }}>
                    Select Type
                  </Button>
                </div>
              </Grid>
              <div style={{ marginTop: '5px' }}>
                {selectedRequestTypes.map((rt, i) => (
                  <Tag
                    key={i}
                    text={rt.label}
                    color="blueLight"
                    removeButtonLabel="Remove"
                    onAfterRemoveAction={(text) => {
                      const foundRequestType = selectedRequestTypes.find(
                        (x) => x.label === text
                      );
                      setRequestTypes((prev) => [...prev, foundRequestType]);
                      setSelectedRequestTypes((prev) =>
                        prev.filter((x) => x.label !== text)
                      );
                    }}
                  />
                ))}
              </div>
            </FormSection>

            {/* request field selection */}
            <FormSection>
              <Grid
                templateColumns="3fr 1fr"
                alignItems="end"
                columnGap="space.200"
                justifyItems="stretch">
                <Field
                  name="Request Type for Field Selection"
                  label="Select request fields to include in the prompt for request type"
                  defaultValue={null}
                  validate={(value) => {
                    setSelectRequestTypeForFieldValue(value);
                    setSelectedRequestTypeFields(
                      requestTypeFields[value?.value] || []
                    );
                  }}>
                  {({ fieldProps: { id, ...rest } }) => {
                    return (
                      <Fragment>
                        <Select
                          inputId={id}
                          {...rest}
                          options={selectedRequestTypes}
                          placeholder={'Find/select request type'}
                          isClearable
                          isDisabled={selectedRequestTypes.length === 0}
                        />
                        {/* {selectHasError && (
                                        <ErrorMessage>{errorMessages.selectError}</ErrorMessage>
                                    )} */}
                      </Fragment>
                    );
                  }}
                </Field>
              </Grid>

              <Grid
                templateColumns="3fr 1fr"
                alignItems="end"
                columnGap="space.200"
                justifyItems="stretch">
                <Field
                  name="Request Field Selection"
                  defaultValue={null}
                  validate={(value) => {
                    setSelectRequestFieldValue(value);
                    // setRequestTypeFields(fields[value?.value] || []);
                  }}>
                  {({ fieldProps: { id, ...rest } }) => {
                    return (
                      <Fragment>
                        <Select
                          inputId={id}
                          {...rest}
                          options={fieldsOptions}
                          placeholder={'Find/select request field to add'}
                          isClearable
                          isDisabled={selectRequestTypeForFieldValue === null}
                        />
                        {/* {selectHasError && (
                            <ErrorMessage>{errorMessages.selectError}</ErrorMessage>
                        )} */}
                      </Fragment>
                    );
                  }}
                </Field>
                <div>
                  <Button
                    appearance="link"
                    isDisabled={selectRequestTypeForFieldValue === null}
                    onClick={() => {
                      const field = selectRequestFieldValue?.value;
                      const fieldValues = {
                        label: field,
                        placeholder: fields[field],
                      };

                      setSelectedRequestTypeFields((prev) => [
                        ...prev,
                        fieldValues,
                      ]);

                      const requestType = selectRequestTypeForFieldValue?.value;
                      const currentFields = { ...requestTypeFields };
                      currentFields[requestType] = [
                        ...currentFields[requestType],
                        fieldValues,
                      ];
                      setRequestTypeFields(currentFields);
                    }}>
                    Add Field
                  </Button>
                </div>
              </Grid>

              <Stack>
                {selectedRequestTypeFields.map((f, i) => (
                  <RequestTypeField
                    key={i}
                    index={i}
                    label={f.label}
                    placeholder={f.placeholder}
                    handleDelete={(index) => {
                      setSelectedRequestTypeFields((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      const field = selectRequestTypeForFieldValue?.value;
                      const currentFields = { ...requestTypeFields };
                      currentFields[field] = currentFields[field].filter(
                        (_, i) => i !== index
                      );
                      setRequestTypeFields(currentFields);
                    }}
                  />
                ))}
              </Stack>
            </FormSection>
          </form>
        )}
      </Form>
    </Box>
  );
}

PromptSettings.propTypes = {
  settingsData: PropTypes.object,
  setPromptSettings: PropTypes.func,
};

function RequestTypeField({ index, label, placeholder, handleDelete }) {
  const onDelete = () => {
    handleDelete(index);
  };

  return (
    <Grid
      templateColumns="1fr 4fr 1fr"
      alignItems="end"
      columnGap="space.200"
      xcss={xcss({ marginTop: '10px' })}>
      <Label htmlFor="os">{label}:</Label>
      <TextField placeholder={placeholder} />
      <Button appearance="danger" onClick={onDelete}>
        Delete
      </Button>
    </Grid>
  );
}

RequestTypeField.propTypes = {
  index: PropTypes.number,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  handleDelete: PropTypes.func,
};
