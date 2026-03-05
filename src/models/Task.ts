export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export interface TaskData {
    id: string;
    title: string;
    description?: string;
    completed?: boolean;
    priority?: Priority;
    dueDate?: Date;
}

export class Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority?: Priority;
    dueDate?: Date;
    createdAt: Date;

    constructor(data: TaskData) {
        if (!data.id) {
            throw new Error('Task ID is required');
        }
        if (!data.title) {
            throw new Error('Task title is required');
        }

        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.completed = data.completed ?? false;
        this.priority = data.priority;
        this.dueDate = data.dueDate;
        this.createdAt = new Date();
    }

    markComplete(): void {
        this.completed = true;
    }

    markIncomplete(): void {
        this.completed = false;
    }

    updateTitle(newTitle: string): void {
        if (!newTitle) {
            throw new Error('Task title cannot be empty');
        }
        this.title = newTitle;
    }

    updatePriority(newPriority?: Priority): void {
        this.priority = newPriority;
    }

    updateDueDate(newDueDate?: Date): void {
        this.dueDate = newDueDate;
    }
}
