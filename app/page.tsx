"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [error, setError] = useState<string | null>(null);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
      error: (err) => console.error("Error fetching todos:", err),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  async function createTodo() {
    try {
      const content = window.prompt("Todo content");
      if (content) {
        await client.models.Todo.create({
          content: content,
        });
        setError(null);
      }
    } catch (err) {
      console.error("Error creating todo:", err);
      setError("Failed to create todo. Please try again.");
    }
  }

  async function deleteTodo(id: string) {
    try {
      await client.models.Todo.delete({ id });
      setError(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete todo. Please try again.");
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId} todos</h1>
          <button onClick={createTodo}>+ new</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.content}
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
              Review next steps of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
