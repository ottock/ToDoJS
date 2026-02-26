// imports
import { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

// project imports
import TaskConsumer from "../../infrastructure/repository/taskConsumer";

/* =========================
   PRIORITY CONFIG
========================= */

const PRIORITY_CONFIG = {
  H: { label: "Alta", severity: "danger", icon: "pi pi-angle-double-up" },
  M: { label: "Média", severity: "warning", icon: "pi pi-angle-up" },
  L: { label: "Baixa", severity: "success", icon: "pi pi-angle-down" },
};

const PRIORITY_OPTIONS = Object.entries(PRIORITY_CONFIG).map(([key, val]) => ({
  label: val.label,
  value: key,
  icon: val.icon,
}));

// Theme asset URLs resolved by Vite
const LIGHT_THEME_HREF = new URL(
  "../assets/theme-light.css",
  import.meta.url
).href;
const DARK_THEME_HREF = new URL(
  "../assets/theme-dark.css",
  import.meta.url
).href;

function PriorityTemplate(option) {
  if (!option) return null;
  const cfg = PRIORITY_CONFIG[option.value];
  return (
    <div className="flex align-items-center gap-2">
      <i className={cfg.icon} />
      <span>{cfg.label}</span>
    </div>
  );
}

/* =========================
   TASK CARD
========================= */

function TaskCard({ task, onEdit, onDelete, onDragStart, onDrop }) {
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.M;
  const [hover, setHover] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="surface-card border-round-lg border-1 surface-border p-3 mb-3"
      style={{
        cursor: "grab",
        borderRadius: "12px",
        boxShadow: hover
          ? "0 10px 22px rgba(0,0,0,0.18)"
          : "0 6px 18px rgba(0,0,0,0.12)",
        background: "var(--surface-card)",
        borderColor: "var(--surface-border)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        padding: "0.75rem 1.1rem 1rem 1.1rem",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDrop) onDrop(e);
      }}
    >
      <div
        className="flex align-items-center mb-3"
        style={{ position: "relative", paddingRight: "3.5rem" }}
      >
        <span
          className="font-semibold"
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.name}
        </span>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <Tag
            severity={priority.severity}
            icon={priority.icon}
            value={priority.label}
          />
          <Button
            icon="pi pi-ellipsis-h"
            text
            rounded
            severity="secondary"
            onClick={() => onEdit(task)}
            style={{ padding: 0, width: "1.6rem", height: "1.6rem" }}
          />
        </div>
      </div>
      <div
        style={{
          height: "3px",
          borderRadius: "999px",
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          background: "var(--primary-color)",
          opacity: 0.9,
        }}
      />

      {task.description && (
        <p className="text-sm m-0 mb-3" style={{ lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      <div
        className="flex justify-content-end gap-2"
        style={{ marginTop: "0.25rem" }}
      >
        <Button
          icon="pi pi-trash"
          text
          rounded
          severity="danger"
          onClick={() => onDelete(task)}
          style={{
            padding: 0,
            width: "1.8rem",
            height: "1.8rem",
          }}
        />
      </div>
    </div>
  );
}

/* =========================
   COLUMN
========================= */

function KanbanColumn({
  title,
  tasks,
  columnStatus,
  onEdit,
  onDelete,
  onDrop,
  onDragStart,
  showCreateButton = false,
  onCreate,
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        setDragOver(false);
        onDrop(e, columnStatus);
      }}
      className={`surface-card border-round-xl border-1 p-3 ${
        dragOver ? "border-primary" : "surface-border"
      }`}
      style={{
        minWidth: "520px",
        minHeight: "520px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="flex align-items-center mb-2"
        style={{ gap: "0.75rem" }}
      >
        <Badge
          value={tasks.length}
          severity={columnStatus ? "success" : "danger"}
          style={{ borderRadius: "999px", minWidth: "2rem" }}
        />
        <span className="font-bold">{title}</span>
      </div>

      <Divider />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-column align-items-center justify-content-center py-4 text-500">
            <i className="pi pi-inbox text-3xl mb-2" />
            <span>Arraste tarefas para cá</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop ? (e) => onDrop(e, columnStatus, task.id) : undefined}
            />
          ))
        )}

        {showCreateButton && (
          <Button
            label="Nova Tarefa"
            icon="pi pi-plus"
            size="small"
            onClick={onCreate}
            style={{ alignSelf: "stretch" }}
          />
        )}
      </div>
    </div>
  );
}

/* =========================
   HOME
========================= */

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDark, setIsDark] = useState(false);

  const [editVisible, setEditVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    priority: "M",
  });

  const [createVisible, setCreateVisible] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    priority: "M",
  });

  const dragTask = useRef(null);
  const toast = useRef(null);

  const apiUrl = useMemo(
    () => import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    []
  );

  const consumer = useMemo(() => new TaskConsumer(apiUrl), [apiUrl]);

  /* =========================
     THEME SWITCH
  ========================= */

  useEffect(() => {
    let link = document.getElementById("theme-link");
    if (!link) {
      link = document.createElement("link");
      link.id = "theme-link";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = isDark ? DARK_THEME_HREF : LIGHT_THEME_HREF;
  }, [isDark]);

  /* =========================
     LOAD TASKS
  ========================= */

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await consumer.readAllTasks();
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        setError("Erro ao carregar tarefas.");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [consumer]);

  /* =========================
     DRAG
  ========================= */

  const handleDragStart = (e, task) => {
    dragTask.current = task;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e, status, targetId) => {
    e.preventDefault();
    if (!dragTask.current) return;

    const source = dragTask.current;
    dragTask.current = null;

    // Reorder within same column (status) when dropping on a task
    if (source.status === status && targetId && targetId !== source.id) {
      setTasks((prev) => {
        const inColumn = prev.filter((t) => t.status === status);
        const others = prev.filter((t) => t.status !== status);

        const fromIndex = inColumn.findIndex((t) => t.id === source.id);
        const toIndex = inColumn.findIndex((t) => t.id === targetId);

        if (fromIndex === -1 || toIndex === -1) return prev;

        const updatedColumn = [...inColumn];
        const [moved] = updatedColumn.splice(fromIndex, 1);
        updatedColumn.splice(toIndex, 0, moved);

        return [...others, ...updatedColumn];
      });
      return;
    }

    // Move between columns (change status)
    if (source.status === status) return;

    const updated = { ...source, status };
    setTasks((prev) =>
      prev.map((t) => (t.id === source.id ? updated : t))
    );

    await consumer.updateTask(source.id, updated);
  };

  /* =========================
     EDIT
  ========================= */

  const openEdit = (task) => {
    setEditingTask(task);
    setEditForm(task);
    setEditVisible(true);
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Nome obrigatório",
      });
      return;
    }

    await consumer.updateTask(editingTask.id, editForm);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id ? editForm : t
      )
    );
    setEditVisible(false);
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (task) => {
    await consumer.deleteTask(task.id);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  /* =========================
     CREATE
  ========================= */

  const openCreate = () => {
    setCreateForm({ name: "", description: "", priority: "M" });
    setCreateVisible(true);
  };

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Nome obrigatório",
      });
      return;
    }

    const payload = {
      ...createForm,
      status: false,
    };

    const created = await consumer.createTask(payload);
    setTasks((prev) => [...prev, created]);
    setCreateVisible(false);
  };

  const todo = tasks.filter((t) => !t.status);
  const done = tasks.filter((t) => t.status);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen p-4 surface-section">
      <Toast ref={toast} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>To Do JS</h2>
        </div>
        <Button
          icon={isDark ? "pi pi-moon" : "pi pi-sun"}
          label={isDark ? "Tema Escuro" : "Tema Claro"}
          size="small"
          text
          onClick={() => setIsDark((v) => !v)}
        />
      </div>

      {loading ? (
        <div className="flex justify-content-center">
          <ProgressSpinner />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            overflowX: "auto",
            width: "100%",
          }}
        >
          <KanbanColumn
            title="A Fazer"
            tasks={todo}
            columnStatus={false}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            showCreateButton
            onCreate={openCreate}
          />
          <KanbanColumn
            title="Concluídas"
            tasks={done}
            columnStatus={true}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
          />
        </div>
      )}

      <Dialog
        header="Editar Tarefa"
        visible={editVisible}
        onHide={() => setEditVisible(false)}
        style={{ width: "400px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <InputText
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
            placeholder="Nome"
          />
          <InputTextarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                description: e.target.value,
              })
            }
            rows={3}
            placeholder="Descrição"
          />
          <Dropdown
            value={editForm.priority}
            options={PRIORITY_OPTIONS}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                priority: e.value,
              })
            }
            itemTemplate={PriorityTemplate}
            valueTemplate={PriorityTemplate}
          />
          <Button label="Salvar" onClick={handleSave} />
        </div>
      </Dialog>

      <Dialog
        header="Nova Tarefa"
        visible={createVisible}
        onHide={() => setCreateVisible(false)}
        style={{ width: "400px" }}
      >
        <div className="flex flex-column gap-3">
          <InputText
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
            placeholder="Nome"
          />
          <InputTextarea
            value={createForm.description}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                description: e.target.value,
              })
            }
            rows={3}
            placeholder="Descrição"
          />
          <Dropdown
            value={createForm.priority}
            options={PRIORITY_OPTIONS}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                priority: e.value,
              })
            }
            itemTemplate={PriorityTemplate}
            valueTemplate={PriorityTemplate}
          />
          <Button label="Criar" onClick={handleCreate} />
        </div>
      </Dialog>
    </div>
  );
}