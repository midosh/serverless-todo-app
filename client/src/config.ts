// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '6qc6dzm20h'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'sls-udagram.auth0.com',            // Auth0 domain
  clientId: 'KbqVZ1cvKiKQCTWED9grzpE9z4H30rS9',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
