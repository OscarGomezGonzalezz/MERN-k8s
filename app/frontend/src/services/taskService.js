// const baseUri = 'http://node-service:3500/tasks';

export const getTasks = async (token) => {
  try {
    const response = await fetch('/api/tasks', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const createTask = async (task, token) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ description: task }),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const updateTask = async (id, updatedField, token) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: token,
       },
      body: JSON.stringify(updatedField),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};