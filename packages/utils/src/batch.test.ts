import { describe, it, expect } from 'vitest';
import { batch, type BatchReturn } from './batch.js';
import { waitFor } from './util.js';
import { beforeEach } from 'vitest';
import { vi } from 'vitest';

type AddTodo = {
  title: string;
  done?: boolean;
  description?: string;
};

type Todo = Required<AddTodo> & {
  id: string;
};

async function addTodos(todos: AddTodo[]): BatchReturn<AddTodo, Todo> {
  const mapped = todos.map(
    (todo) =>
      [
        todo,
        {
          id: crypto.randomUUID(),
          ...todo,
        } as Todo,
      ] as const,
  );
  const values = new Map<AddTodo, Todo>(mapped);

  //biome-ignore lint/style/noNonNullAssertion: This is test code.
  return (todo): Todo => values.get(todo)!;
}

describe('Batch', () => {
  it('Works with multiple calls in separate batch windows', async () => {
    const batchedAddTodos = batch(addTodos);
    const f = batchedAddTodos({
      title: 'do the thing',
    });

    const b = await batchedAddTodos({
      title: 'and the other thing',
    });

    await waitFor(400);
    const a = batchedAddTodos({
      title: 'third',
    });

    expect(await f).toHaveProperty('id');
    expect(await b).toHaveProperty('id');
    await waitFor(400);

    expect(await a).toHaveProperty('title');
  });

  it('Works with a single call within the window', async () => {
    const mockFn = vi.fn(async () => (todo) => todo);
    const batchedAddTodos = batch(mockFn, 50);
    batchedAddTodos(1);
    await waitFor(51);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith([1]);
  });
});
