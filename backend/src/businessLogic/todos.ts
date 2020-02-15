import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return todoAccess.getTodos(userId)
}
export async function deleteTodo(jwtToken: string,todoId: string){
	  const userId = parseUserId(jwtToken)
	return todoAccess.deleteTodo(userId,todoId)

}
export async function generateUploadUrl(jwtToken: string,todoId:string){
	  const userId = parseUserId(jwtToken)
	return todoAccess.generateUploadUrl(userId,todoId)
}
export async function updateTodo(jwtToken: string,todoReq:UpdateTodoRequest, todoId: string){
	 const userId = parseUserId(jwtToken)
	return todoAccess.updateTodo(userId,todoReq, todoId)
}
export async function createTodo(todoReq: CreateTodoRequest,jwtToken: string): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    createdAt: Date.now.toString(),
    ...todoReq,
    done: false });
}


