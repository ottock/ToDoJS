// imports
import { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

// project imports
import TaskConsumer from "../../infrastructure/repository/task_consumer";

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

const LIGHT_THEME_HREF = "/src/presentation/assets/theme-light.css";
const DARK_THEME_HREF = "/src/presentation/assets/theme-dark.css";
const STACK_COLUMNS_MEDIA_QUERY = "(max-width: 1100px), (orientation: portrait)";

const PRIORITY_COLORS = {
  H: "#ef4444",
  M: "#f59e0b",
  L: "#22c55e",
};

const PRIORITY_RANK = {
  H: 3,
  M: 2,
  L: 1,
};

function parseISODateString(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function formatISODateString(value) {
  if (!value) return null;
  const date = parseISODateString(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateKey(value) {
  return formatISODateString(value);
}

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

function SkeletonTaskCard() {
  return (
    <div
      className="surface-card border-round-lg border-1 surface-border p-3 mb-3"
      style={{
        borderRadius: "12px",
        background: "var(--surface-card)",
        border: `2px dashed var(--surface-border)`,
        padding: "0.75rem 1.1rem 1rem 1.1rem",
      }}
    >
      {/* Top row: Date, Priority, Menu */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <Skeleton width="40%" height="0.9rem" />
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <Skeleton width="80px" height="1.8rem" borderRadius="16px" />
          <Skeleton width="30px" height="1.8rem" borderRadius="4px" />
        </div>
      </div>
      {/* Title skeleton */}
      <div style={{ marginBottom: "0.75rem" }}>
        <Skeleton width="60%" height="1.5rem" />
      </div>
      <div
        style={{
          height: "3px",
          borderRadius: "999px",
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          background: "var(--primary-color)",
          opacity: 0.3,
        }}
      />
      <Skeleton width="100%" height="2rem" style={{ marginBottom: "0.5rem" }} />
      <Skeleton width="85%" height="1rem" />
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd, onDrop, isDragging }) {
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.M;

  // Format date from YYYY-MM-DD to DD/MM/YY format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    // dateString comes as "YYYY-MM-DD" format from backend
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(date.getTime())) return dateString; // If invalid, return original
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };

  const fromDateLabel = task.from_date ? formatDate(task.from_date) : "--/--/--";
  const dueDateLabel = task.due_date ? formatDate(task.due_date) : "--/--/--";
  const createdDateLabel = task.created_date ? formatDate(task.created_date) : "--/--/--";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
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
          : "scale(1)",
        opacity: isDragging ? 0.7 : 1,
        padding: "0.75rem 1.1rem 1rem 1.1rem",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDrop) onDrop(e);
      }}
    >
      {/* Top row: Created/From/Due dates, Priority, Menu */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "nowrap" }}
      >
        {/* Created / From / Due dates - left */}
        <div style={{ fontSize: "0.75rem", color: "var(--text-color-secondary)", display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0, whiteSpace: "nowrap" }}>
          <i className="pi pi-calendar" style={{ fontSize: "0.7rem" }} />
          <span>
            <strong>Created:</strong> {createdDateLabel}
          </span>
          <span style={{ opacity: 0.7 }}>|</span>
          <span>
            <strong>From:</strong> {fromDateLabel}
          </span>
          <span style={{ opacity: 0.7 }}>|</span>
          <span>
            <strong>Due:</strong> {dueDateLabel}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Priority and Menu - right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0, whiteSpace: "nowrap" }}>
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

      {/* Title */}
      <div
        className="mb-3"
        style={{}}
      >
        <span
          className="font-semibold"
          style={{
            display: "block",
            fontWeight: 800,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.name}
        </span>
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
        <p
          className="text-sm m-0 mb-3"
          style={{ lineHeight: 1.5, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
        >
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
  onDragEnd,
  showCreateButton = false,
  onCreate,
  showClearButton = false,
  onClear,
  priorityFilter,
  onPriorityFilterChange,
  draggedTaskId,
  loading = false,
  stackOnMobilePortrait = false,
}) {
  const [dragOver, setDragOver] = useState(false);

  const filteredTasks = priorityFilter
    ? Array.isArray(priorityFilter)
      ? tasks.filter((t) => priorityFilter.includes(t.priority))
      : tasks.filter((t) => t.priority === priorityFilter)
    : tasks;

  // Calcula a altura dinâmica baseada no número de tasks
  const getColumnHeight = () => {
    const baseHeight = 350; // altura mínima (empty state com "Drag tasks here")
    const tasksCount = loading ? 4 : filteredTasks.length;
    
    if (tasksCount === 0) return baseHeight;
    
    // Expande ~100px a cada task, sem limite máximo
    const expandedHeight = baseHeight + (tasksCount * 100);
    return expandedHeight;
  };

  const columnHeight = getColumnHeight();

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
        width: stackOnMobilePortrait ? "100%" : "min(560px, calc((100vw - 6rem) / 2))",
        minWidth: stackOnMobilePortrait ? "100%" : "360px",
        maxWidth: stackOnMobilePortrait ? "100%" : "600px",
        flex: stackOnMobilePortrait ? "1 1 100%" : "1 1 360px",
        minHeight: `${columnHeight}px`,
        display: "flex",
        flexDirection: "column",
        transition: "min-height 0.3s ease, background-color 0.2s ease, border-color 0.2s ease",
        backgroundColor: dragOver ? "rgba(var(--primary-500), 0.05)" : "var(--surface-card)",
        border: `2px solid ${dragOver ? "var(--primary-color)" : "var(--surface-border)"}`,
        borderRadius: "16px",
        padding: "1.5rem",
      }}
    >
      <div
        className="flex align-items-center mb-3"
        style={{ gap: "1.25rem" }}
      >
        <Badge
          value={loading ? "..." : filteredTasks.length}
          severity={columnStatus ? "success" : "danger"}
          style={{ borderRadius: "999px", minWidth: "2rem", marginRight: "0.25rem" }}
        />
        <span
          className="text-lg"
          style={{ fontWeight: 800, marginLeft: "0.25rem" }}
        >
          {title}
        </span>
      </div>

      <Divider style={{ margin: "0.5rem 0 1rem 0" }} />

      {showCreateButton && (
        <Button
          label="New Task"
          icon="pi pi-plus"
          severity="success"
          outlined
          onClick={onCreate}
          disabled={loading}
          style={{ alignSelf: "stretch", marginBottom: "1rem" }}
        />
      )}

      {showClearButton && (
        <Button
          label="Clear Completed"
          icon="pi pi-trash"
          severity="danger"
          outlined
          onClick={onClear}
          disabled={loading}
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
          disabled={loading}
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
        {loading ? (
          <>
            <SkeletonTaskCard />
            <SkeletonTaskCard />
            <SkeletonTaskCard />
            <SkeletonTaskCard />
          </>
        ) : filteredTasks.length === 0 ? (
          <div
            className="flex flex-column align-items-center justify-content-center py-6 text-500"
            style={{
              flex: 1,
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i
              className="pi pi-inbox text-4xl"
              style={{ display: "block", marginBottom: "0.75rem" }}
            />
            <span style={{ display: "block", textAlign: "center" }}>
              Drag tasks here
            </span>
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
              onDragEnd={onDragEnd}
              onDrop={
                onDrop
                  ? (e) => {
                      setDragOver(false);
                      onDrop(e, columnStatus, task.id);
                    }
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function CalendarColumn({ tasks, stackOnMobilePortrait = false }) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const monthDays = useMemo(() => {
    const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const leadingBlanks = start.getDay();
    const cells = [];

    for (let i = 0; i < leadingBlanks; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= end.getDate(); day += 1) {
      cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [viewDate]);

  const eventsByDate = useMemo(() => {
    const map = new Map();

    for (const task of tasks) {
      const fromDate = parseISODateString(task.from_date);
      const dueDate = parseISODateString(task.due_date);

      if (fromDate && dueDate) {
        const start = fromDate.getTime() <= dueDate.getTime() ? fromDate : dueDate;
        const end = fromDate.getTime() <= dueDate.getTime() ? dueDate : fromDate;

        for (
          let day = new Date(start.getFullYear(), start.getMonth(), start.getDate());
          day.getTime() <= end.getTime();
          day.setDate(day.getDate() + 1)
        ) {
          const key = getDateKey(day);
          const existing = map.get(key) ?? { linePriority: null, dotPriority: null };

          if (
            !existing.linePriority ||
            PRIORITY_RANK[task.priority] > PRIORITY_RANK[existing.linePriority]
          ) {
            existing.linePriority = task.priority;
          }

          map.set(key, existing);
        }
      } else if (!fromDate && dueDate) {
        const key = getDateKey(dueDate);
        const existing = map.get(key) ?? { linePriority: null, dotPriority: null };

        if (
          !existing.dotPriority ||
          PRIORITY_RANK[task.priority] > PRIORITY_RANK[existing.dotPriority]
        ) {
          existing.dotPriority = task.priority;
        }

        map.set(key, existing);
      }
    }

    return map;
  }, [tasks]);

  const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];

    return tasks
      .filter((task) => {
        const fromDate = parseISODateString(task.from_date);
        const dueDate = parseISODateString(task.due_date);

        if (fromDate && dueDate) {
          const start = fromDate.getTime() <= dueDate.getTime() ? fromDate : dueDate;
          const end = fromDate.getTime() <= dueDate.getTime() ? dueDate : fromDate;
          return selectedDate.getTime() >= start.getTime() && selectedDate.getTime() <= end.getTime();
        }

        if (!fromDate && dueDate) {
          return selectedDate.getTime() === dueDate.getTime();
        }

        if (fromDate && !dueDate) {
          return selectedDate.getTime() === fromDate.getTime();
        }

        return false;
      })
      .sort((a, b) => {
        const priorityDiff = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return Number(a.status) - Number(b.status);
      });
  }, [selectedDate, tasks]);

  const goToCurrentMonth = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <div
      className="surface-card border-round-xl surface-border"
      style={{
        width: stackOnMobilePortrait ? "100%" : "min(560px, calc((100vw - 6rem) / 2))",
        minWidth: stackOnMobilePortrait ? "100%" : "360px",
        maxWidth: stackOnMobilePortrait ? "100%" : "600px",
        flex: stackOnMobilePortrait ? "1 1 100%" : "1 1 360px",
        minHeight: "450px",
        backgroundColor: "var(--surface-card)",
        border: "2px solid var(--surface-border)",
        borderRadius: "16px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="mb-3" style={{ display: "flex", justifyContent: "center" }}>
        <span className="text-lg" style={{ fontWeight: 800 }}>Calendar</span>
      </div>

      <div
        className="mb-2"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
          <Button
            icon="pi pi-angle-left"
            text
            rounded
            style={{ width: "2rem", height: "2rem" }}
            onClick={() =>
              setViewDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
              )
            }
          />
          <span
            style={{
              minWidth: "10rem",
              height: "2rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(viewDate)}
          </span>
          <Button
            icon="pi pi-angle-right"
            text
            rounded
            style={{ width: "2rem", height: "2rem" }}
            onClick={() =>
              setViewDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
              )
            }
          />
      </div>

      <div className="mb-2" style={{ display: "flex", justifyContent: "center" }}>
        <Button
          icon="pi pi-refresh"
          label="Current Month"
          text
          onClick={goToCurrentMonth}
        />
      </div>

      <Divider style={{ margin: "0.4rem 0 0.7rem 0" }} />

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: "0.25rem",
            marginBottom: "0.35rem",
          }}
        >
          {weekDayLabels.map((label) => (
            <div
              key={label}
              style={{
                fontSize: "0.75rem",
                opacity: 0.7,
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: "0.25rem",
          }}
        >
          {monthDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  style={{ height: "2.2rem", borderRadius: "8px" }}
                />
              );
            }

            const key = getDateKey(day);
            const event = eventsByDate.get(key);
            const fillPriority = [event?.linePriority, event?.dotPriority]
              .filter(Boolean)
              .sort((a, b) => PRIORITY_RANK[b] - PRIORITY_RANK[a])[0];
            const fillColor = fillPriority ? PRIORITY_COLORS[fillPriority] : null;
            const textColor = fillColor ? "#ffffff" : "var(--text-color)";
            const isSelected = selectedDate?.getTime() === day.getTime();

            return (
              <div
                key={key}
                onClick={() =>
                  setSelectedDate((prev) =>
                    prev?.getTime() === day.getTime() ? null : new Date(day.getFullYear(), day.getMonth(), day.getDate())
                  )
                }
                style={{
                  position: "relative",
                  height: "2.2rem",
                  borderRadius: "8px",
                  border: fillColor ? `1px solid ${fillColor}` : "1px solid var(--surface-border)",
                  backgroundColor: fillColor || "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: isSelected ? "inset 0 0 0 2px var(--primary-color)" : "none",
                  transform: isSelected ? "translateY(-1px)" : "none",
                  transition: "transform 0.12s ease, box-shadow 0.12s ease",
                }}
              >
                <span style={{ position: "relative", zIndex: 1, fontWeight: 700, color: textColor }}>
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <>
            <Divider style={{ margin: "0.8rem 0 0.6rem 0" }} />

            <div
              style={{
                border: "1px solid var(--surface-border)",
                borderRadius: "10px",
                padding: "0.75rem",
                maxHeight: "170px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginBottom: "0.55rem",
                }}
              >
                Tasks on {new Intl.DateTimeFormat("pt-BR").format(selectedDate)}
              </div>

              {selectedDateTasks.length === 0 ? (
                <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>No tasks for this day.</span>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  {selectedDateTasks.map((task) => (
                    <div
                      key={`selected-${task.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                        }}
                      >
                        {task.name}
                      </span>
                      <Tag
                        severity={PRIORITY_CONFIG[task.priority]?.severity || "info"}
                        value={PRIORITY_CONFIG[task.priority]?.label || "Unknown"}
                        style={{ fontSize: "0.7rem", minWidth: "4.5rem", justifyContent: "center" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
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
    from_date: null,
    due_date: null,
  });

  const [createVisible, setCreateVisible] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    priority: "L",
    from_date: null,
    due_date: null,
  });

  const [todoFilter, setTodoFilter] = useState(["H", "M", "L"]);
  const [doneFilter, setDoneFilter] = useState(["H", "M", "L"]);
  const [stackOnMobilePortrait, setStackOnMobilePortrait] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(STACK_COLUMNS_MEDIA_QUERY).matches
      : false
  );

  const dragTask = useRef(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const toast = useRef(null);

  const apiUrl = useMemo(() => {
    const host = String(import.meta.env.BACKEND_HOST || "").trim();
    const port = String(import.meta.env.BACKEND_PORT || "").trim();

    if (!host || !port) {
      throw new Error("BACKEND_HOST and BACKEND_PORT must be defined in .env");
    }

    return `http://${host}:${port}`;
  }, []);

  const consumer = useMemo(() => new TaskConsumer(apiUrl), [apiUrl]);

  /* =========================
     THEME SWITCH
  ========================= */

  useEffect(() => {
    const link = document.getElementById("theme-link");
    if (!link) return;

    const nextHref = isDark ? DARK_THEME_HREF : LIGHT_THEME_HREF;
    if (link.getAttribute("href") !== nextHref) {
      link.setAttribute("href", nextHref);
    }
    
    // Salvar tema no localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(STACK_COLUMNS_MEDIA_QUERY);
    const updateViewport = () => setStackOnMobilePortrait(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

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

  const handleDragEnd = () => {
    dragTask.current = null;
    setDraggedTaskId(null);
  };

  const handleDrop = async (e, status, targetId) => {
    try {
      e.preventDefault();
      
      if (!dragTask.current) {
        setDraggedTaskId(null);
        return;
      }

      const source = dragTask.current;
      dragTask.current = null;

      // Move between columns (change status)
      if (source.status !== status) {
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
      } else if (targetId && targetId !== source.id) {
        // Reorder within same column (status) when dropping on a task
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
      }
    } finally {
      setDraggedTaskId(null);
    }
  };

  const validateDateRule = (formData) => {
    const fromDate = parseISODateString(formData.from_date);
    const dueDate = parseISODateString(formData.due_date);

    if (fromDate && !dueDate) {
      toast.current?.show({
        severity: "warn",
        summary: "Due date is required when from date is set",
      });
      return false;
    }

    if (fromDate && dueDate && fromDate.getTime() > dueDate.getTime()) {
      toast.current?.show({
        severity: "warn",
        summary: "From date cannot be after due date",
      });
      return false;
    }

    return true;
  };

  /* =========================
     EDIT
  ========================= */

  const openEdit = (task) => {
    setEditingTask(task);
    setEditForm({
      ...task,
      from_date: parseISODateString(task.from_date),
      due_date: parseISODateString(task.due_date),
    });
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

    if (!validateDateRule(editForm)) {
      return;
    }

    const payload = {
      ...editingTask,
      ...editForm,
      from_date: formatISODateString(editForm.from_date),
      due_date: formatISODateString(editForm.due_date),
    };

    await consumer.updateTask(editingTask.id, payload);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id ? { ...t, ...payload } : t
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
    setCreateForm({
      name: "",
      description: "",
      priority: "L",
      from_date: null,
      due_date: null,
    });
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

    if (!validateDateRule(createForm)) {
      return;
    }

    const payload = {
      ...createForm,
      priority: createForm.priority || "L",
      status: false,
      from_date: formatISODateString(createForm.from_date),
      due_date: formatISODateString(createForm.due_date),
    };

    const created = await consumer.createTask(payload);
    setTasks((prev) => [...prev, created]);
    setCreateVisible(false);
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.status);

    if (completedTasks.length === 0) {
      toast.current?.show({
        severity: "info",
        summary: "No completed tasks to clear",
      });
      return;
    }

    await Promise.all(completedTasks.map((task) => consumer.deleteTask(task.id)));
    setTasks((prev) => prev.filter((t) => !t.status));

    toast.current?.show({
      severity: "success",
      summary: "Completed tasks cleared",
    });
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
          <h2 style={{ margin: 0 }}>ToDoJS</h2>
        </div>
        <Button
          icon={isDark ? "pi pi-moon" : "pi pi-sun"}
          label={isDark ? "Dark Theme" : "Light Theme"}
          size="small"
          text
          onClick={() => setIsDark((v) => !v)}
        />
      </div>

      {error ? (
        <div>{error}</div>
      ) : (
        <div
          className="kanban-container"
          style={{
            display: "flex",
            flexDirection: stackOnMobilePortrait ? "column" : "row",
            alignItems: stackOnMobilePortrait ? "stretch" : "flex-start",
            justifyContent: "center",
            gap: "1rem",
            overflowX: stackOnMobilePortrait ? "hidden" : "auto",
            overflowY: "visible",
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
            onDragEnd={handleDragEnd}
            showCreateButton
            onCreate={openCreate}
            priorityFilter={todoFilter}
            onPriorityFilterChange={setTodoFilter}
            draggedTaskId={draggedTaskId}
            loading={loading}
            stackOnMobilePortrait={stackOnMobilePortrait}
          />
          <KanbanColumn
            title="Completed"
            tasks={done}
            columnStatus={true}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            showClearButton
            onClear={handleClearCompleted}
            priorityFilter={doneFilter}
            onPriorityFilterChange={setDoneFilter}
            draggedTaskId={draggedTaskId}
            loading={loading}
            stackOnMobilePortrait={stackOnMobilePortrait}
          />
          <CalendarColumn
            tasks={tasks}
            stackOnMobilePortrait={stackOnMobilePortrait}
          />
        </div>
      )}

      <Dialog
        header="Edit Task"
        visible={editVisible}
        onHide={() => setEditVisible(false)}
        style={{ width: "min(400px, 92vw)" }}
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
          <Calendar
            value={editForm.from_date}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                from_date: e.value,
              })
            }
            dateFormat="yy-mm-dd"
            showIcon
            placeholder="From Date (optional)"
          />
          <Calendar
            value={editForm.due_date}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                due_date: e.value,
              })
            }
            dateFormat="yy-mm-dd"
            showIcon
            placeholder="Due Date (optional)"
          />
          <Button label="Save" onClick={handleSave} />
        </div>
      </Dialog>

      <Dialog
        header="New Task"
        visible={createVisible}
        onHide={() => setCreateVisible(false)}
        style={{ width: "min(400px, 92vw)" }}
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
          <Calendar
            value={createForm.from_date}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                from_date: e.value,
              })
            }
            dateFormat="yy-mm-dd"
            showIcon
            placeholder="From Date (optional)"
          />
          <Calendar
            value={createForm.due_date}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                due_date: e.value,
              })
            }
            dateFormat="yy-mm-dd"
            showIcon
            placeholder="Due Date (optional)"
          />
          <Button label="Create" onClick={handleCreate} />
        </div>
      </Dialog>
    </div>
  );
}