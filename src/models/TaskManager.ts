import { Task, Priority } from './Task';

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

    getTasks(): Task[] {
        return [...this.tasks];
    }
}
