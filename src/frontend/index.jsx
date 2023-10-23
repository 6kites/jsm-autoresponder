import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Text,
  TextArea,
  Form,
  Button,
  ButtonSet,
} from "@forge/react";
import { invoke, requestJira } from "@forge/bridge";
import api from "@forge/api";

async function Something(issue_key) {
  console.log("SOMETHING");
  const response = await requestJira(`/rest/api/3/issue/${issue_key}`);
  console.log("SOMETHING STATUS", response.status);
  console.log("SOMETHING RESPONSE", await response.json());
}

async function getIssueDetails(issue_key) {
  const response = await requestJira(`/rest/api/3/issue/${issue_key}`);
  return await response.json();
}

const App = () => {
  const delete_response = () => {
    console.log("IN DELETE RESPONSE");
    let new_data = { ...data };
    new_data.testing = "DELETED RESPONSE";
    setData(new_data);
  };

  const edit_response = () => {
    let new_data = { ...data };
    new_data.mode = data.mode === "EDIT" ? "VIEW" : "EDIT";
    setData(new_data);
  };

  const text_box = (answer, mode) => {
    console.log("TEXT BOX ANSWER", answer);
    console.log("TEXT BOX MODE", mode);
    let jsx = (
      <Text label="Pending AI Generated Response" name="PendingResponse">
        {answer ? answer : "Loading..."}
      </Text>
    );

    if (mode == "EDIT") {
      jsx = (
        <TextArea
          label="Pending AI Generated Response"
          name="PendingResponse"
          value={answer ? answer : "Loading..."}
          onChange={onChangeResponse}
        ></TextArea>
      );
    }

    return jsx;
  };

  const [data, setData] = useState(null);
  const [formState, setFormState] = useState(undefined)
  const [editPrompt, setEditPrompt] = useState()
  const onSubmit = (formData) => {
    console.log("FORM DATA:")
    console.log(formData)
    setFormState(formData)
  }

  const onChangeResponse = (value) => {
    console.log("ON CHANGE RESPONSE---")
    console.log(value)
  }
  const onChangePrompt = (value) => {
    console.log("ON CHANGE PROMPT ---")
    console.log(value)
    setEditPrompt(value)
  }

  useEffect(() => {
    invoke("getText", { example: "my-invoke-variable" }).then(setData);
  }, []);

  if (!data) {
    return <>Loading...</>;
  }

  const actionButtons = [
        <Button>Send To Customer</Button>,
        <Button>Regenerate</Button>,
        <Button appearance="danger">Discard</Button>
    ]

  console.log("frontend----");
  console.log("RAW", data);
  console.log("ISSUE", data.issue);
  console.log("PROJECT", data.project);
  console.log("TESTING", data.testing);
  console.log("ANSWER", data.answer);
  console.log("MODE", data.mode);
  console.log("PROMPT", data.prompt);

  let ai_answer = data.answer?.value?.pending_response;
  let mode = data.mode;
  let prompt = data.prompt;

  if (data.testing === "DELETED RESPONSE") {
    return (
      <>
        <Text>Pending Response Deleted</Text>
      </>
    );
  } else {
    return (
      <>
        {/* <Form
          onSubmit={onSubmit}
          actionButtons={actionButtons}
          submitButtonText="Edit">
        </Form> */}
          <TextArea name="example" label="Example" onChange={onChangePrompt} defaultValue={prompt}></TextArea>
        <TextArea
          name="PromptArea"
          label="Custom Prompt"
          defaultValue={prompt}
          onChange={onChangePrompt}
        ></TextArea>

        {text_box(ai_answer, mode)}
        <ButtonSet>
          <Button
            appearance="default"
            onClick={() => {
              console.log("Edit Mode");
              edit_response();
            }}
          >
            {data.mode === "VIEW" ? "Edit" : "Save"}
          </Button>
          <Button
            appearance="default"
            onClick={() => {
              Something();
              console.log(
                "Send (possibly edited) response To customer. Clear Pending State.",
              );
            }}
          >
            Send To Customer
          </Button>
          <Button appearance="default">Regenerate</Button>
          <Button
            appearance="danger"
            onClick={() => {
              console.log("Clear Pending Response");
              delete_response();
            }}
          >
            Discard
          </Button>
        </ButtonSet>
      </>
    );
  }
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
