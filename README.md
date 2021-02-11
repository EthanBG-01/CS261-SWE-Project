# CS261-SWE-PROJECT

## Setting up the Virtual Envs for the Back-End Services.
**Prerequisites** : Python & Pip.

*Note:* If you're just running this via docker, this step isn't strictly necessary. This essentially will
let you run the files as a script on your computer. (NOTE: API ENDPOINTS ARE DIFFERENT AS DOCKER USES A PROXY). <br>
Additionally, you could run each service as an individual container - or as part of the overall system with docker compose.

To run the python files locally; you'll need to follow the following steps. <br>
In each of the python api service directories, you'll need a virtual environment before installing the libraries.<br>
The following article goes into detail if you need:<br>
https://medium.com/@negi.sandeep01906/how-to-set-the-virtual-environment-for-the-python-project-5b0592c28307.
  - First make sure you have pip installed
  - Then install virtualenv using `pip install virtualenv` 
  - Make sure you're in the folder (So, `/user, /feedback or /event`) and run `virtualenv env`
  - Activate the virtual environment using `env\Scripts\activate`, command line should now show `(env) C:\Users\sandy\Desktop\testEnv>` (example from article)
  - Install the requirements: `pip install -r requirements.txt`
  - Then to leave the virtual environment type `deactivate`
  - Currently, there's only Flask in each virtual environment (The reason they're separated is for DOCKER!)
  - Yes this is a bit tedious but eh dude I had a 5 hr bug cause of a backslash lmao!!!

## Installing the React Scripts for front-end:
**Prerequisites** : NodeJS.
- Navigate into the `/react-client` directory.
- Run `npm install`.
- This is quite a big set of files so might take a bit of time - yeah react is a beast so don't be suprised if this is like >1GB.
- To view the react project, run `npm start`. It might take a bit of time, but should launch in browser.

## Running Docker:
**Prerequisites** : Docker (Windows Home Edition - Be warned there are several windows versions)<br>
*I learnt the hard way oops.*<br>
Once Docker is installed, you can simply run the following commands to launch the entire app.
```bash
docker compose build
docker compose up
```
- The build command will definitely take some time when first run, don't be alarmed.
- Compose up: should then be able to access the react site by typing localhost into your browser.
- Other API services can be accessed by typing 'localhost/user', 'localhost/event', 'localhost/feedback' they'll return test JSON objects as plaintext in browser.
- Insomnia/ postman will also be able to contact them.
  - If these API services are run just on their own as a python script on your computer; then the URL is localhost:5001 for user, 5002 event and 5003 feedback etc. *This may be something we look at for production bulds*
- Note; docker compose should be in the desktop install - but if you get errors double check you have it!
- Docker Compose is different to plain docker.

If you open the desktop application you should see that a docker compose container cs261-swe-group-project is running.<br>
To stop; just Ctrl + C in the terminal.<br>
SOMETIMES it doesn't shut down properly and so actually deleting the containers via the desktop app is required.

The `docker-compose.yml` file acts as the orchestrator; this is where databases will need to be added as well!
- E.g. make sure the `user` service depends on the sqlite database etc.
