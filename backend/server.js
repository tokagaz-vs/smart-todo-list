import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Инициализируем клиент OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Временное хранилище в памяти (в реальном проекте используйте базу данных!)
let todos = [];
let idCounter = 1;

// Получить все задачи
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Создать новую задачу
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Текст задачи обязателен' });
    }

    const newTodo = {
      id: idCounter++,
      text,
      completed: false,
      subTasks: [], // AI будет генерировать подзадачи
      createdAt: new Date().toISOString()
    };

    // Если задача сложная (содержит более 5 слов), генерируем подзадачи с помощью AI
    if (text.split(' ').length > 5) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Ты помощник для декомпозиции задач. Разбей основную задачу на 3-4 конкретные, простые подзадачи. Верни ответ в виде массива строк, без номеров и лишних символов."
            },
            {
              role: "user",
              content: `Разбей задачу "${text}" на подзадачи.`
            }
          ],
          max_tokens: 150,
        });

        const aiResponse = completion.choices[0].message.content;
        // Парсим ответ AI, предполагая, что каждая подзадача на новой строке
        const generatedSubTasks = aiResponse.split('\n')
          .filter(task => task.trim().length > 5) // Фильтруем пустые строки
          .map(task => ({
            id: Date.now() + Math.random(), // Простой способ генерации ID
            text: task.replace(/^[-•\d.\s]+/, '').trim(), // Убираем маркеры списка
            completed: false
          }));

        newTodo.subTasks = generatedSubTasks.slice(0, 4); // Берем не более 4 подзадач
      } catch (aiError) {
        console.error('Ошибка AI:', aiError);
        // Если AI не сработал, просто продолжаем без подзадач
      }
    }

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    res.status(500).json({ error: 'Не удалось создать задачу' });
  }
});

// Переключить статус выполнения задачи
app.patch('/api/todos/:id/toggle', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === parseInt(id));
  
  if (!todo) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  todo.completed = !todo.completed;
  res.json(todo);
});

// Переключить статус подзадачи
app.patch('/api/todos/:todoId/subtasks/:subTaskId/toggle', (req, res) => {
  const { todoId, subTaskId } = req.params;
  const todo = todos.find(t => t.id === parseInt(todoId));
  
  if (!todo) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  const subTask = todo.subTasks.find(st => st.id === parseFloat(subTaskId));
  if (!subTask) {
    return res.status(404).json({ error: 'Подзадача не найдена' });
  }

  subTask.completed = !subTask.completed;
  res.json(subTask);
});

// Удалить задачу
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex(t => t.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
});