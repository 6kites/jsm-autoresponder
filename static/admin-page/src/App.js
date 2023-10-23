import React, { useEffect, useState, Fragment, useCallback } from "react";
import { invoke } from "@forge/bridge";
import ButtonGroup from "@atlaskit/button/button-group";
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button/standard-button";
import TextField from "@atlaskit/textfield";
import Spinner from '@atlaskit/spinner'
import Select, {
  components,
  OptionProps,
  SingleValueProps,
  ValueType,
} from '@atlaskit/select';

import Form, {
  CheckboxField,
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  RequiredAsterisk,
  ValidMessage,
  Label
} from "@atlaskit/form";
import { Radio } from "@atlaskit/radio"
import { Inline, Stack, Grid, xcss } from '@atlaskit/primitives';
import Tag from '@atlaskit/tag';
import ModelModal from "./components/ModelModal";


function App() {
  const [data, setData] = useState(null);
  const [tokenIsSet, setTokenIsSet] = useState("");
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({})
  const [selectHasError, setSelectHasError] = useState(false);
  const [selectValue, setSelectValue] = useState();
  const [models, setModels] = useState([
    { name: "ChatGPT / OpenAI (Default)", checked: true, url: "https://api.openai.com", apiToken: "12345678", default: true },
    { name: "LLaMa 2 Base (Custom)", checked: false, url: "https://my-llama.company.com/api", apiToken: "12345678" },
    { name: "LLaMa 2 Trained (Custom)", checked: false, url: "https://my-llama.company.com/api", apiToken: "12345678" }
  ])

  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProperties = async () => {
    const properties = await invoke("getAdminProperties", { example: "my-invoke-variable", url: inputs.url });
    setData(properties);
    const apiTokenIsSet =  properties.apiTokenIsSet;
    setTokenIsSet(apiTokenIsSet);
    setInputs({
      url: properties.url
    })
  }

  const fetchProjects = async() => {
    const results = await invoke("getProjects");
    const transformedProjects = results.map(project => ({ label: project.name, value: project.key }))
    setProjects(transformedProjects)
    setIsLoading(false)
  }

  useEffect(() => {
    // fetchProperties();
    fetchProjects()
  }, []);

  const onSubmit = (values, form, callback) => {
    console.log({values, form, callback})
    // invoke("setAdminProperties", { url: inputs.url, apiToken: inputs.apiToken });
    // TODO: add if statement here for errors
    console.log({inputs})
    }

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleDeleteModel = (index) => {
    const newModels = [...models]
    newModels.splice(index, 1)
    setModels(newModels)
  }

  const handleSelectBlurEvent = () => {
    selectValue ? setSelectHasError(false) : setSelectHasError(true);
  };

  const gptServices = [
    { label: 'ChatGPT', value: 'ChatGPT' },
    { label: 'MockGPT', value: 'MockGPT' },
  ];

  const errorMessages = {
    emptyApiToken: 'Invalid username, needs to be more than 4 characters',
    selectError: 'Please select a service',
  };

  if (isLoading) {
    return <Spinner interactionName='load' />
  }
  
  return (
    <div
        style={{
        display: "flex",
        width: "500px",
        maxWidth: "100%",
        flexDirection: "column",
      }}>
        <Form onSubmit={onSubmit}>
          {({ formProps, submitting, reset }) => (
            <form noValidate {...formProps}>
              <FormHeader title="">
              </FormHeader>
              <FormSection>
              <Grid templateColumns="3fr 1fr" alignItems="end" columnGap="space.200" justifyItems="stretch">
                <Field
                  name="Project Selection"
                  label="Enable for the following projects:"
                  defaultValue={null}
                  isRequired
                  validate={(value) => {
                    setSelectValue(value);
                  }}
                >
                  {({ fieldProps: { id, ...rest } }) => {
                    return (
                      <Fragment>
                        <Select
                          inputId={id}
                          {...rest}
                          options={projects}
                          isClearable
                          // isMulti
                          aria-invalid={selectHasError}
                          aria-describedby={selectHasError && `${id}-error`}
                          onBlur={handleSelectBlurEvent}
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
                    isDisabled={projects.length === 0}
                    onClick={(event) => {
                      if (!selectValue) return
                      setSelectedProjects(projects => [...projects, selectValue])
                      setProjects(prev => prev.filter(proj => proj.value !== selectValue.value))
                      reset()
                    }}
                  >
                    Add Project
                  </Button>
                </div>
                
              </Grid>
                <div style={{marginTop: '5px'}}>
                  {selectedProjects.map((project, i) => 
                    <Tag key={i} text={project.label} color="blueLight" removeButtonLabel="Remove"
                    onAfterRemoveAction={(text) => {
                      const foundProject = selectedProjects.find(proj => proj.label === text);
                      console.log({foundProject})
                      setProjects(prev => [...prev, foundProject])
                      setSelectedProjects(prev => prev.filter(proj => proj.label !== text))
                      // reset()
                    }} />
                  )}
                </div>
              </FormSection>

              <FormSection>
                <h4>AI Engine / Model Settings</h4>
                <div style={{marginTop: '10px'}}>
                  <Label>Models</Label>
                  <Stack space="space.150">
                    {models.map((model, i) => <ModelSettings key={i} index={i} model={model} handleDelete={handleDeleteModel} />)}
                    <Inline as="div" style={{marginTop: '20px'}}>
                      <ModelModal
                        title="Add Custom Model"
                        btnAppearance="primary"
                        btnText="Add Model"
                        handleSubmit={(value) => {
                          if (Object.keys(value).length === 0 || value === undefined) return

                          value.checked = false
                          setModels(values => ([...values, value]))
                        }}
                      >
                      </ModelModal>
                    </Inline>
                  </Stack>
                </div>
              </FormSection>
              <FormFooter>
              </FormFooter>
            </form>
          )}
        </Form>
    </div>
  );


  function ModelSettings({model, index, handleDelete}) {
    const { name, checked } = model
    const deleteCssColor = "#DE350B"
    const onDelete = () => {
      handleDelete(index)
    }

    const handleSubmit = (value) => {
      value.checked = false;
      const newModels = [...models];
      newModels[index] = value;
      setModels(newModels);
    }

    return (
      <Grid templateColumns="2fr 1fr 1fr 1fr" alignItems="center">
          <p>{name}</p>
          <Radio
            value="default radio"
            label="Active"
            name="radio-default"
            testId="radio-default"
            isChecked={checked} />
        <ModelModal modelData={model} handleSubmit={handleSubmit}></ModelModal>
        {!checked && 
          <Button
            appearance="link"
            style={{textDecorationColor: deleteCssColor}}
            onClick={onDelete}
          >
            <span style={{color: deleteCssColor}}>Delete</span>
          </Button>}
      </Grid>
    )
  }
}

export default App;
