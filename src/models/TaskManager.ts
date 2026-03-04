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
