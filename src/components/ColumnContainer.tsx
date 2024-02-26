import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnTitle: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
}

const ColumnContainer = (props: ColumnContainerProps) => {
  const {
    column,
    deleteColumn,
    updateColumnTitle,
    createTask,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=' bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-500'
      ></div>
    );
  }

  return (
    <section
      ref={setNodeRef}
      style={style}
      className=' bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col'
    >
      <header
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className='bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between'
      >
        <div className='flex gap-2'>
          <p className='flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full'>
            0
          </p>
          {!editMode && column.title}
          {editMode && (
            <input
              className='bg-black border-2 focus:border-rose-500 border-rounded outline-none px-2'
              value={column.title}
              onChange={(e) =>
                updateColumnTitle(column.id, e.target.value)
              }
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className='stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2'
        >
          <TrashIcon />
        </button>
      </header>
      <main className='flex flex-grow'>Content</main>
      <button
        className='flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black'
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add Task
      </button>
    </section>
  );
};

export default ColumnContainer;