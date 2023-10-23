# JSM Autoresponder

This application is a forge app that is intended to watch for queries on a JSM ticket and on submission of a ticket, will send the request to ChatGPT API (potentially alternative backend LLM engines) to attempt to answer a question (or to help agents).

The answer will be either sent as a response to the customer or will be saved to the ticket as a "pending response" (using issues properties) for an agent to either approve for sending to a customer, edit and send to customer, or to reject completely.

## Forge Overview

This project was built using Atlassian Forge. See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- First time, cd to a **DIFFERENT FOLDER FROM THIS REPOSITORY** use the following

`forge login`
`forge create`

Name your app the same as the app in this repository and choose UI Kit 2 app (this doesn't matter much, we'll ignore the code from this that was created).

This will create a new forge app for you that you can see by going to your [Developer Console](https://developer.atlassian.com/console/myapps/). We are only going to use this for your personal development copy of this app so you can get a new app id.

In this repository, you can then replace the id in *manifest.yml* under tha **app** section of this repository with the app id from the app you just generated.

Forge currently doesn't allow multiple developers to work on a single app so this is the workaround. We may create a common app dev account in the future that we can use for this purpose.

- Install dependencies

  ```sh
  npm install
  ```

- Build the react front end

  ```sh
  cd static/hello-world
  npm install
  npm run build
  ```

  - For easier realtime frontend page refresh/debug

    ```sh
    npm start
    ```

- Build and deploy your app by running by going back to root folder:

  ```sh
  forge deploy
  ```

- Install your app in an Atlassian site by running:

  ```sh
  forge install
  # when changing the manifest or making major updates to the code, add `--upgrade`
  # eg. forge install --upgrade
  ```

- Develop your app by running `forge tunnel` to proxy invocations locally:

  ```sh
  forge tunnel

  # for debugging, add `--debug`
  # eg. forge tunnel --debug
  ```


### Installing for Staging / Production

In order to deploy to a staging or production environment you can run the following on the build that you would like to deploy:

```
$ forge deploy -e staging
$ forge install -e staging
```

...to install into staging environment...

```
$ forge deploy -e production
$ forge install -e production
```

...to install into a production environment.

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
