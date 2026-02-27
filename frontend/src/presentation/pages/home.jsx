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
  H: { label: "High", severity: "danger", icon: "pi pi-angle-double-up" },
  M: { label: "Medium", severity: "warning", icon: "pi pi-angle-up" },
  L: { label: "Low", severity: "success", icon: "pi pi-angle-down" },
};

const PRIORITY_OPTIONS = Object.entries(PRIORITY_CONFIG).map(([key, val]) => ({
  label: val.label,
  value: key,
  icon: val.icon,
}));

const FILTER_OPTIONS = [
  { label: "All Priorities", value: ["H", "M", "L"] },
  { label: "High", value: "H" },
  { label: "Medium", value: "M" },
  { label: "Low", value: "L" },
];

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

function TaskCard({ task, onEdit, onDelete, onDragStart, onDrop, isDragging }) {
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
        boxShadow: "none",
        background: "var(--surface-card)",
        border: `2px dashed var(--surface-border)`,
        transition: "transform 0.15s ease, opacity 0.15s ease, border-color 0.15s ease",
        transform: isDragging 
          ? "scale(0.90) rotate(2deg)" 
          : hover 
          ? "translateY(-2px)" 
          : "translateY(0)",
        opacity: isDragging ? 0.7 : 1,
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
  priorityFilter,
  onPriorityFilterChange,
  draggedTaskId,
}) {
  const [dragOver, setDragOver] = useState(false);

  const filteredTasks = priorityFilter
    ? Array.isArray(priorityFilter)
      ? tasks.filter((t) => priorityFilter.includes(t.priority))
      : tasks.filter((t) => t.priority === priorityFilter)
    : tasks;

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
      className={`surface-card border-round-xl ${
        dragOver ? "border-primary" : "surface-border"
      }`}
      style={{
        minWidth: "600px",
        minHeight: "700px",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
        backgroundColor: dragOver ? "rgba(var(--primary-500), 0.05)" : "var(--surface-card)",
        border: `2px solid ${dragOver ? "var(--primary-color)" : "var(--surface-border)"}`,
        borderRadius: "16px",
        padding: "1.5rem",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          div[style*='minWidth: "600px"'] {
            minWidth: 100% !important;
            minHeight: auto !important;
          }
        }
      `}</style>
      <div
        className="flex align-items-center mb-3"
        style={{ gap: "0.75rem" }}
      >
        <Badge
          value={filteredTasks.length}
          severity={columnStatus ? "success" : "danger"}
          style={{ borderRadius: "999px", minWidth: "2rem" }}
        />
        <span className="font-bold text-lg">{title}</span>
      </div>

      <Divider style={{ margin: "0.5rem 0 1rem 0" }} />

      {showCreateButton && (
        <Button
          label="New Task"
          icon="pi pi-plus"
          onClick={onCreate}
          style={{ alignSelf: "stretch", marginBottom: "1rem" }}
        />
      )}

      <div style={{ marginBottom: "1rem" }}>
        <Dropdown
          value={priorityFilter}
          options={FILTER_OPTIONS}
          onChange={(e) => onPriorityFilterChange(e.value)}
          placeholder="Filter by priority"
          showClear
          style={{ width: "100%" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {filteredTasks.length === 0 ? (
          <div className="flex flex-column align-items-center justify-content-center py-6 text-500">
            <i className="pi pi-inbox text-4xl mb-3" />
            <span>Drag tasks here</span>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={draggedTaskId === task.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop ? (e) => onDrop(e, columnStatus, task.id) : undefined}
            />
          ))
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

  // Carregar tema do localStorage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

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

  const [todoFilter, setTodoFilter] = useState(["H", "M", "L"]);
  const [doneFilter, setDoneFilter] = useState(["H", "M", "L"]);

  const dragTask = useRef(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
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
    
    // Salvar tema no localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* =========================
     LOAD TASKS
  ========================= */

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await consumer.readAllTasks();
        // Ordenar tasks por ordem
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => (a.order || 0) - (b.order || 0))
          : [];
        setTasks(sortedData);
      } catch {
        setError("Error loading tasks.");
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
    setDraggedTaskId(task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e, status, targetId) => {
    e.preventDefault();
    setDraggedTaskId(null);
    
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

        // Atualizar ordem de todas as tasks da coluna
        const updatedWithOrder = updatedColumn.map((task, index) => ({
          ...task,
          order: index,
        }));

        // Salvar ordem no backend
        Promise.all(
          updatedWithOrder.map((task) =>
            consumer.updateTask(task.id, task)
          )
        );

        return [...others, ...updatedWithOrder];
      });
      return;
    }

    // Move between columns (change status)
    if (source.status === status) return;

    // Atualizar status e recalcular ordem
    setTasks((prev) => {
      const updated = { ...source, status };
      const newTasks = prev.map((t) => (t.id === source.id ? updated : t));
      
      // Reorganizar ordem na coluna de destino
      const inDestColumn = newTasks.filter((t) => t.status === status);
      const others = newTasks.filter((t) => t.status !== status);
      
      const updatedWithOrder = inDestColumn.map((task, index) => ({
        ...task,
        order: index,
      }));

      // Salvar no backend
      consumer.updateTask(source.id, { ...updated, order: updatedWithOrder.length - 1 });

      return [...others, ...updatedWithOrder];
    });
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
        summary: "Name is required",
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
        summary: "Name is required",
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

      <style>{`
        @media (max-width: 768px) {
          .kanban-container {
            flex-direction: column !important;
          }
          .kanban-container > div {
            width: 100% !important;
          }
        }
        
        @media (orientation: portrait) and (max-width: 1024px) {
          .kanban-container {
            flex-direction: column !important;
          }
        }
      `}</style>

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
          label={isDark ? "Dark Theme" : "Light Theme"}
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
          className="kanban-container"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
            paddingBottom: "0.5rem",
            scrollBehavior: "smooth",
          }}
        >
          <KanbanColumn
            title="To Do"
            tasks={todo}
            columnStatus={false}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            showCreateButton
            onCreate={openCreate}
            priorityFilter={todoFilter}
            onPriorityFilterChange={setTodoFilter}
            draggedTaskId={draggedTaskId}
          />
          <KanbanColumn
            title="Completed"
            tasks={done}
            columnStatus={true}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            priorityFilter={doneFilter}
            onPriorityFilterChange={setDoneFilter}
            draggedTaskId={draggedTaskId}
          />
        </div>
      )}

      <Dialog
        header="Edit Task"
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
            placeholder="Name"
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
            placeholder="Description"
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
          <Button label="Save" onClick={handleSave} />
        </div>
      </Dialog>

      <Dialog
        header="New Task"
        visible={createVisible}
        onHide={() => setCreateVisible(false)}
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
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
            placeholder="Name"
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
            placeholder="Description"
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
          <Button label="Create" onClick={handleCreate} />
        </div>
      </Dialog>
    </div>
  );
}