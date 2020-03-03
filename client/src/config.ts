// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'r0eu2x4kq1'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'sls-todo.auth0.com',            // Auth0 domain
  clientId: 'LpUVMu0AA2v0gOE4dCo9FCL3F9NwSQE3',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
