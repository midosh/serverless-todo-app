import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)


import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE ,
    private readonly userIndex = process.env.USER_ID_INDEX,
    private readonly bucketName = process.env.TODOS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly s3 = new AWS.S3({
    signatureVersion: 'v4'
    })

    ) {}

  async getTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
       TableName : this.todosTable,
       IndexName : this.userIndex,
       KeyConditionExpression: 'userId = :userId',
       ExpressionAttributeValues: {
         ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async deleteTodo(userId: string,todoId: string){
    const deleted = await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      }).promise();

     return deleted;

  }
  async generateUploadUrl(userId: string,todoId:string){
    const validTodoId = await this.todoExists(userId,todoId)
  if (!validTodoId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }

  
    

   const uploadUrl= this.s3.getSignedUrl('putObject', {
    Bucket: this.bucketName,
    Key: todoId,
    Expires: this.urlExpiration
  })

   await this.docClient.update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ":attachmentUrl":`https://${this.bucketName}.s3.amazonaws.com/${todoId}`
        },
      }).promise();

   return uploadUrl;
  }


async  todoExists(userId: string,todoId: string) {
  const result = await this.docClient
    .get({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId

      }
    })
    .promise()

  console.log('Get todo: ', result)
  return !!result.Item
}

  async updateTodo(userId:string,updatedTodo: TodoUpdate, todoId:string){
    const newUpdatedTodo = await this.docClient.update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set todoName = :name, dueDate = :date, done = :done',
        ExpressionAttributeValues: {
          ':name':updatedTodo.name,
          ':date':updatedTodo.dueDate,
          ':done':updatedTodo.done
        },
        ReturnValues: "ALL_NEW"
      }).promise();

    return newUpdatedTodo
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    
    await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
    
      return todo;

    }
  }

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}