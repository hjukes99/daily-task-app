import { Task, Priority } from './Task';

export interface TaskFilters {
    completed?: boolean;
    priority?: Priority;
}

export class TaskManager {
    private tasks: Task[] = [];
    private nextId: number = 1;

    createTask(title: string, description?: string, priority?: Priority, dueDate?: Date): Task {
        if (!title) {
            throw new Error('Task title is required');
        }

        const id = this.nextId.toString();
        this.nextId++;
        
        const task = new Task({
            id,
            title,
            description,
            priority,
            dueDate
        });
        
        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error(`Task with ID ${id} not found`);
        }
        this.tasks.splice(index, 1);
    }

    editTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            throw new Error(`Task with ID ${id} not found`);
        }

        if (updates.title !== undefined) {
            task.updateTitle(updates.title);
        }
        if (updates.description !== undefined) {
            task.description = updates.description;
        }
        if (updates.priority !== undefined) {
            task.updatePriority(updates.priority);
        }
        if (updates.dueDate !== undefined) {
            task.dueDate = updates.dueDate;
        }
        if (updates.completed !== undefined) {
            if (updates.completed) {
                task.markComplete();
            } else {
                task.markIncomplete();
            }
        }

        return task;
    }

    getTasks(filters?: TaskFilters): Task[] {
        let result = this.tasks;

        if (filters) {
            if (filters.completed !== undefined) {
                result = result.filter(task => task.completed === filters.completed);
            }
            if (filters.priority !== undefined) {
                result = result.filter(task => task.priority === filters.priority);
            }
        }

        return [...result];
    }
}
