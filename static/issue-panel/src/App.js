import React, { useEffect, useState } from 'react';
import { events, invoke, view } from '@forge/bridge';
import TextArea from "@atlaskit/textarea";
import { Label } from "@atlaskit/form";
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from "@atlaskit/button/loading-button";
import { Grid } from "@atlaskit/primitives";
import SendIcon from '@atlaskit/icon/glyph/send';
import RefreshIcon from '@atlaskit/icon/glyph/refresh'
import EditIcon from '@atlaskit/icon/glyph/edit'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import CheckIcon from '@atlaskit/icon/glyph/check'
import Spinner from '@atlaskit/spinner';
import ParagraphClamp from './components/ParagraphClamp';


function App() {
  const [data, setData] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [promptResponse, setPromptResponse] = useState()
  const [prompt, setPrompt] = useState()
  const [isSendToLoading, setIsSendToLoading] = useState(false)
  const [isRegenerateToLoading, setIsRegenerateLoading] = useState(false)
  const [commentedViaApp, setCommentedViaApp] = useState(false)
  const [commentSent, setCommentSent] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const handleFetchSuccess = (data) => {
    setData(data);
    setPrompt(data?.prompt)
    setPromptResponse(data?.answer?.ai_response)
    if (!data?.answer?.ai_response) setButtonDisabled(true)

    if (!data) {
      throw new Error('No data returned');
    }
  };
  const handleFetchError = () => {
    console.error('Failed to get data');
  };

  function removeResponse() {
    invoke("removeAiResponse").then(console.log("AI answer was cleared"));
    setPromptResponse('');
  }

  const onClickEdit = (event) => {
    event.preventDefault();
    setIsReadOnly(!isReadOnly);
  }

  const onClickRegenerate = (event) => {
    setIsRegenerateLoading(true)
    const callChatGpt = async () => invoke("callChatGPT", { prompt: prompt });
    callChatGpt().then((data) => {
      setPromptResponse(data?.answer)
      setIsRegenerateLoading(false)
      setButtonDisabled(false)
    })
  }

  const onClickSendToCustomer = (event) => {
    setCommentedViaApp(true)
    setIsSendToLoading(true)
    const addComment = async () => invoke("addComment", { comment: promptResponse })
    addComment().then((data) => {
      setCommentedViaApp(true)
      setIsSendToLoading(false)
      removeResponse()
      setPrompt('')
      setCommentSent(true)
    })
  }

  const onClickDiscard = (event) => {
    removeResponse();
    setButtonDisabled(true)
  }

  const onChangeResponse = (event) => {
    setPromptResponse(event.target.value)
  }

  const onChangePrompt = (event) => {
    setPrompt(event.target.value)
  }

  const ResponseField = () => {
    const jsx = isReadOnly
      ? <ParagraphClamp
          text={promptResponse}
          id="pendingResponse" />
      : <TextArea 
          id='pendingResponse'
          name='pendingResponse'
          // appearance='subtle'
          value={promptResponse}
          onChange={onChangeResponse}
        />

    return jsx
  }

  useEffect(() => {
    const getData = async () => invoke("getData");
    getData().then(handleFetchSuccess).catch(handleFetchError);
  }, []);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // this useEffect is to not refresh the UI when the app is sending a comment
  useEffect(() => {
    const subscribeForIssueChangedEvent = () =>
      events.on('JIRA_ISSUE_CHANGED', (data) => {
        // NOTE: might need to remove this condition
        // no need to refresh if autoresponse is enabled
        if (data?.projectSettings?.autoresponseEnabled) {
          setCommentedViaApp((_) => true)
          return
        }

        // return if the event type was not a comment
        if (!data?.changes?.some(c => c.changeType === "commented")) return

        // check if the comment was added by our app
        if (!commentedViaApp) {
          // only refresh UI if a user/customer commented
          sleep(100).then(() => {
            view.refresh()
          })
        }
        setCommentedViaApp(false)
      });
    const subscription = subscribeForIssueChangedEvent();

    return () => {
      subscription.then((subscription) => subscription.unsubscribe());
    };
  }, [commentedViaApp])
  


  if (!data) {
    return <Spinner interactionName='load' />
  }

  if (data?.projectSettings?.autoresponseEnabled) {
    return <p>AI Autoresponse is enabled</p>
  }

  if (commentSent) {
    return <p>Respond sent. Waiting for customer's response...</p>
  }

  return (
    <>
      <Grid gap='space.200'>
        {(data?.projectSettings?.editPromptEnabled || false) &&
          <div>
            <Label htmlFor='promptArea'>Custom Prompt</Label>
            <TextArea 
              id='promptArea'
              name='promptArea'
              value={prompt}
              onChange={onChangePrompt}
            />
          </div>
        } 
        <div>
          <Label htmlFor='pendingResponse'>AI Generated Response</Label>
          {promptResponse && ResponseField()}
        </div>
        <div>
          <ButtonGroup>
            {(data?.projectSettings?.editResponseEnabled || false) &&
              <Button
                appearance={isReadOnly ? 'default' : 'primary'}
                iconBefore={isReadOnly ? <EditIcon label='' size='small' /> : <CheckIcon label='' size='small' />}
                isDisabled={buttonDisabled}
                onClick={onClickEdit}>
                  {isReadOnly ? "Edit" : "Save"}
              </Button>
            }
            <LoadingButton
              appearance='default'
              iconBefore={<SendIcon label='' size='small' />}
              isLoading={isSendToLoading}
              isDisabled={buttonDisabled}
              onClick={onClickSendToCustomer}>
                Send to Customer
            </LoadingButton>
            {(data?.projectSettings?.editPromptEnabled || false) &&
              <LoadingButton
                appearance='default'
                iconBefore={<RefreshIcon label='' size='small' />}
                isLoading={isRegenerateToLoading}
                onClick={onClickRegenerate}>
                  Regenerate
              </LoadingButton>
            }
            <Button
              appearance='danger'
              iconBefore={<TrashIcon label='' size='small' />}
              isDisabled={buttonDisabled}
              onClick={onClickDiscard}>
                Discard
            </Button>
          </ButtonGroup>
        </div>
      </Grid>
    </>
  );
}

export default App;
