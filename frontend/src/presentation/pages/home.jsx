// imports
import { useEffect, useState } from "react";
import TaskConsumer from "../../infrastructure/repository/taskConsumer"; // ajuste o caminho

// instância fora do componente (boa prática)
const api = new TaskConsumer("http://localhost:3000");

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await api.readAllTasks();
        setTasks(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar tarefas.</p>;

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}
