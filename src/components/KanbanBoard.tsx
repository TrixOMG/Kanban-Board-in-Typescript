import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import { generateId } from "../util/util";
import ColumnContainer from "./ColumnContainer";

//42:38

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  const [
    activeColumn,
    setActiveColumn,
  ] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter(
      (column) => column.id !== id
    );
    setColumns(filteredColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      );

      return arrayMove(
        columns,
        activeColumnIndex,
        overColumnIndex
      );
    });
  }

  function updateColumnTitle(id: Id, title: string) {
    const newColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return { ...column, title };
    });

    setColumns(newColumns);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  return (
    <section className='m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]'>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div className='m-auto flex gap-2'>
          <div className='flex gap-4'>
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumnTitle={updateColumnTitle}
                  createTask={createTask}
                  key={column.id}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className='h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2'
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumnTitle={updateColumnTitle}
                createTask={createTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </section>
  );
};

export default KanbanBoard;
