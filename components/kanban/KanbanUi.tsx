'use client'

import React, { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { format } from 'date-fns'
import { getUserBlockNotes, updateBlockNote } from '@/app/[locale]/dashboard/blocknote/action'
import { Loader2, Plus, Calendar as CalendarIcon, User, Flag, MoreVertical, X } from 'lucide-react'

interface KanbanTask {
  id: string
  title: string
  description: string
  status: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: Date | null
  updatedAt: Date
}

interface Column {
  id: string
  title: string
  status: string
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

const KanbanCard: React.FC<{
  task: KanbanTask;
  onMoveTask: (id: string, status: string) => void;
  onEditTask: (task: KanbanTask) => void;
}> = ({ task, onMoveTask, onEditTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      className="mb-4"
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <Button variant="ghost" className="w-full justify-start" onClick={() => onEditTask(task)}>Edit</Button>
              </PopoverContent>
            </Popover>
          </div>
          <CardDescription className="mt-2 line-clamp-2">{task.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between text-sm ">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{task.assignee || 'Unassigned'}</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm ">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{task.dueDate ? format(new Date(task.dueDate), 'PP') : 'No due date'}</span>
            </div>
            <span>Updated: {format(new Date(task.updatedAt), 'PP')}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const KanbanColumn: React.FC<{
  column: Column;
  tasks: KanbanTask[];
  onMoveTask: (id: string, status: string) => void;
  onEditTask: (task: KanbanTask) => void;
}> = ({ column, tasks, onMoveTask, onEditTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string, status: string }) => {
      if (item.status !== column.status) {
        onMoveTask(item.id, column.status)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <motion.div 
      ref={drop} 
      className="p-4 rounded-lg w-full sm:w-80 min-h-[300px]"
      animate={{
        backgroundColor: isOver ? 'rgb(226, 232, 240)' : 'rgb(241, 245, 249)',
        transition: { duration: 0.2 }
      }}
    >
      <h2 className="text-xl font-bold mb-4">{column.title}</h2>
      <AnimatePresence>
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onMoveTask={onMoveTask} onEditTask={onEditTask} />
        ))}
      </AnimatePresence>
      {tasks.length === 0 && (
        <p className="text-center  mt-4">No tasks</p>
      )}
    </motion.div>
  )
}

const TaskForm: React.FC<{
  task?: KanbanTask;
  onSubmit: (task: Partial<KanbanTask>) => void;
  onClose: () => void;
}> = ({ task, onSubmit, onClose }) => {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState(task?.status || 'todo')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [assignee, setAssignee] = useState(task?.assignee || '')
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? new Date(task?.dueDate) : undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, description, status, priority, assignee, dueDate })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="inProgress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignee">Assignee</Label>
        <Input id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
      </div>
      <div>
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              {dueDate ? format(dueDate, 'PP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{task ? 'Update' : 'Create'} Task</Button>
      </div>
    </form>
  )
}

export default function EnhancedKanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>([])
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', title: 'To Do', status: 'todo' },
    { id: '2', title: 'In Progress', status: 'inProgress' },
    { id: '3', title: 'Done', status: 'done' },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updatedAt')
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const result = await getUserBlockNotes()
      if (result.success && result.blockNotes) {
        const kanbanTasks: KanbanTask[] = result.blockNotes.map(note => {
          let content: any;
          try {
            // @ts-ignore
            content = JSON.parse(note.content);
          } catch (error) {
            console.error('Error parsing note content:', error);
            content = { status: 'todo', priority: 'medium', description: '', assignee: '', dueDate: null };
          }
          return {
            id: note.id,
            title: note.title,
            description: content.description || '',
            status: content.status || 'todo',
            priority: content.priority || 'medium',
            assignee: content.assignee || '',
            dueDate: content.dueDate ? new Date(content.dueDate) : null,
            updatedAt: note.updatedAt
          }
        })
        setTasks(kanbanTasks)
      } else {
        throw new Error(result.error || 'Failed to fetch tasks')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const moveTask = async (id: string, newStatus: string) => {
    const taskToUpdate = tasks.find(task => task.id === id)
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status: newStatus }
      await updateTask(updatedTask)
    }
  }

  const updateTask = async (updatedTask: KanbanTask) => {
    try {
      const result = await updateBlockNote(updatedTask.id, updatedTask.title, JSON.stringify(updatedTask))
      if (result.success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        )
      } else {
        throw new Error(result.error || 'Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const addTask = async (newTask: Partial<KanbanTask>) => {
    try {
        // @ts-ignore
      const result = await updateBlockNote(newTask.title || 'New Task', JSON.stringify(newTask))
      if (result.success && result.blockNote) {
        const createdTask: KanbanTask = {
          id: result.blockNote.id,
          title: result.blockNote.title,
          description: newTask.description || '',
          status: newTask.status || 'todo',
          priority: newTask.priority || 'medium',
          assignee: newTask.assignee || '',
          dueDate: newTask.dueDate || null,
          updatedAt: result.blockNote.updatedAt
        }
        setTasks(prevTasks => [...prevTasks, createdTask])
      } else {
        throw new Error(result.error || 'Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: newColumnTitle.trim(),
        status: newColumnTitle.toLowerCase().replace(/\s+/g, '-'),
      }
      setColumns(prevColumns => [...prevColumns, newColumn])
      setNewColumnTitle('')
      setIsAddingColumn(false)
    }
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
        || task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-8">Enhanced Kanban Board</h1>
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select onValueChange={setFilterStatus} defaultValue="all">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {columns.map(column => (
                <SelectItem key={column.id} value={column.status}>{column.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setFilterPriority} defaultValue="all">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSortBy} defaultValue="updatedAt">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={addTask} onClose={() => setIsAddingTask(false)} />
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <Reorder.Group
            axis="x"
            values={columns}
            onReorder={setColumns}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            {columns.map((column) => (
              <Reorder.Item key={column.id} value={column}>
                <KanbanColumn
                  column={column}
                  tasks={filteredAndSortedTasks.filter((task) => task.status === column.status)}
                  onMoveTask={moveTask}
                  onEditTask={setEditingTask}
                />
              </Reorder.Item>
            ))}
            {isAddingColumn ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="New column title"
                  className="w-40"
                />
                <Button onClick={addColumn}>Add</Button>
                <Button variant="ghost" onClick={() => setIsAddingColumn(false)}><X className="h-4 w-4" /></Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsAddingColumn(true)}><Plus className="mr-2 h-4 w-4" /> Add Column</Button>
            )}
          </Reorder.Group>
        )}
      </div>
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={(updatedTask) => {
                updateTask({ ...editingTask, ...updatedTask })
                setEditingTask(null)
              }}
              onClose={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DndProvider>
  )
}