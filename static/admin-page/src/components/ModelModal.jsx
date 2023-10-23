import React, { useEffect, useState, Fragment, useCallback } from "react";
import { invoke } from "@forge/bridge";
import ButtonGroup from "@atlaskit/button/button-group";
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button/standard-button";
import TextField from "@atlaskit/textfield";

import Form, {
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
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';


function ModelModal({modelData, handleSubmit, title='Configure Model', btnAppearance='link', btnText='Configure'}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(modelData?.name || '')
  const [url, setUrl] = useState(modelData?.url || '')
  const [apiToken, setApiToken] = useState(modelData?.apiToken || '')
  const [isDefault, setIsDefault] = useState(modelData?.default || false)
  const [inputs, setInputs] = useState({});

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const onSubmit = (value) => {
    handleSubmit(value)
    close()
  }

  return (
    <>
      <Button appearance={btnAppearance} onClick={open}>{btnText}</Button>

      <ModalTransition>
      {isOpen && (
        <Modal onClose={close}>
          <Form
            onSubmit={onSubmit}
          >
            {({ formProps }) => (
              <form id="form-with-id" {...formProps}>
                <ModalHeader>
                  <ModalTitle>{title}</ModalTitle>
                </ModalHeader>

                <ModalBody>
                  <Field label="Name" name="name" defaultValue={name} isDisabled={isDefault} >
                    {({ fieldProps }) => <TextField {...fieldProps} />}
                  </Field>

                  <Field label="URL" name="url" defaultValue={url} isDisabled={isDefault}>
                    {({ fieldProps }) => (
                      <TextField
                        autoComplete="off"
                        // placeholder="charlie@atlassian.com"
                        {...fieldProps}
                      />
                    )}
                  </Field>

                  <Field name="apiToken" label="API Token" defaultValue={apiToken} isRequired>
                    {({ fieldProps, error }) => (
                      <Fragment>
                        <TextField {...fieldProps} type="password" />
                        {!error && (
                          <HelperMessage>Must not be empty</HelperMessage>
                        )}
                        {/* {errors?.apiToken && <ErrorMessage>{errors?.apiToken}</ErrorMessage>} */}
                      </Fragment>
                    )}
                </Field>

                </ModalBody>
                <ModalFooter>
                  <Button onClick={close} appearance="subtle">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="form-with-id"
                    appearance="primary"
                  >
                    Save
                  </Button>

                  <LoadingButton
                    appearance="default"
                    type="submit"
                    // isLoading={submitting}
                  >
                    Test
                  </LoadingButton>
                  
                </ModalFooter>
              </form>
            )}
          </Form>
        </Modal>
      )}
      </ModalTransition>
    </>
  ); 
}

export default ModelModal;
