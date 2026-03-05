import { TaskManager } from './TaskManager';
import { Priority } from './Task';

describe('TaskManager', () => {
    let taskManager: TaskManager;

    beforeEach(() => {
        taskManager = new TaskManager();
    });

    it('should create a task and add it to the list', () => {
        const task = taskManager.createTask('Buy groceries');
        
        expect(task.id).toBe('1');
        expect(task.title).toBe('Buy groceries');
        expect(task.description).toBeUndefined();
        
        const tasks = taskManager.getTasks();
        expect(tasks.length).toBe(1);
        expect(tasks[0]).toBe(task);
    });

    it('should create a task with all details', () => {
        const dueDate = new Date('2023-12-31');
        const task = taskManager.createTask('Finish project', 'Write code', Priority.High, dueDate);
        
        expect(task.id).toBe('1');
        expect(task.title).toBe('Finish project');
        expect(task.description).toBe('Write code');
        expect(task.priority).toBe(Priority.High);
        expect(task.dueDate).toBe(dueDate);
    });

    it('should generate unique incremental IDs for new tasks', () => {
        const task1 = taskManager.createTask('Task 1');
        const task2 = taskManager.createTask('Task 2');
        
        expect(task1.id).toBe('1');
        expect(task2.id).toBe('2');
        expect(taskManager.getTasks().length).toBe(2);
    });

    it('should throw an error if title is empty', () => {
        expect(() => taskManager.createTask('')).toThrow('Task title is required');
    });

    describe('editTask', () => {
        let taskId: string;

        beforeEach(() => {
            const task = taskManager.createTask('Initial Task', 'Initial Desc', Priority.Medium, new Date('2023-01-01'));
            taskId = task.id;
        });

        it('should update task title', () => {
            const updatedTask = taskManager.editTask(taskId, { title: 'Updated Task' });
            expect(updatedTask.title).toBe('Updated Task');
            expect(taskManager.getTasks()[0].title).toBe('Updated Task');
        });

        it('should update task description', () => {
            const updatedTask = taskManager.editTask(taskId, { description: 'Updated Desc' });
            expect(updatedTask.description).toBe('Updated Desc');
            expect(taskManager.getTasks()[0].description).toBe('Updated Desc');
        });

        it('should update task priority', () => {
            const updatedTask = taskManager.editTask(taskId, { priority: Priority.High });
            expect(updatedTask.priority).toBe(Priority.High);
            expect(taskManager.getTasks()[0].priority).toBe(Priority.High);
        });

        it('should update task dueDate', () => {
            const newDate = new Date('2023-12-31');
            const updatedTask = taskManager.editTask(taskId, { dueDate: newDate });
            expect(updatedTask.dueDate).toBe(newDate);
            expect(taskManager.getTasks()[0].dueDate).toBe(newDate);
        });

        it('should update task completed status', () => {
            const updatedTask = taskManager.editTask(taskId, { completed: true });
            expect(updatedTask.completed).toBe(true);
            expect(taskManager.getTasks()[0].completed).toBe(true);
        });

        it('should allow updating multiple fields at once', () => {
            const newDate = new Date('2024-01-01');
            const updatedTask = taskManager.editTask(taskId, {
                title: 'New Title',
                description: 'New Desc',
                priority: Priority.Low,
                dueDate: newDate,
                completed: true
            });

            expect(updatedTask.title).toBe('New Title');
            expect(updatedTask.description).toBe('New Desc');
            expect(updatedTask.priority).toBe(Priority.Low);
            expect(updatedTask.dueDate).toBe(newDate);
            expect(updatedTask.completed).toBe(true);
        });

        it('should throw an error if task ID does not exist', () => {
            expect(() => taskManager.editTask('non-existent-id', { title: 'New Title' }))
                .toThrow('Task with ID non-existent-id not found');
        });

        it('should throw an error if updating title to empty', () => {
            expect(() => taskManager.editTask(taskId, { title: '' }))
                .toThrow('Task title cannot be empty');
        });
    });

    describe('deleteTask', () => {
        let taskId: string;

        beforeEach(() => {
            const task = taskManager.createTask('Initial Task', 'Initial Desc', Priority.Medium, new Date('2023-01-01'));
            taskId = task.id;
        });

        it('should delete a task if the ID exists', () => {
            taskManager.deleteTask(taskId);
            const tasks = taskManager.getTasks();
            expect(tasks.length).toBe(0);
        });

        it('should throw an error if the task ID does not exist', () => {
            expect(() => taskManager.deleteTask('non-existent-id'))
                .toThrow('Task with ID non-existent-id not found');
        });
    });

    describe('getTasks', () => {
        beforeEach(() => {
            const task1 = taskManager.createTask('Task 1', 'Desc 1', Priority.High);
            const task2 = taskManager.createTask('Task 2', 'Desc 2', Priority.Low);
            const task3 = taskManager.createTask('Task 3', 'Desc 3', Priority.Medium);
            
            task1.markComplete();
            task3.markComplete();
        });

        it('should return all tasks when no filters are provided', () => {
            const tasks = taskManager.getTasks();
            expect(tasks.length).toBe(3);
        });

        it('should filter tasks by completed status', () => {
            const completedTasks = taskManager.getTasks({ completed: true });
            expect(completedTasks.length).toBe(2);
            expect(completedTasks.every(t => t.completed)).toBe(true);
            expect(completedTasks.map(t => t.title)).toContain('Task 1');
            expect(completedTasks.map(t => t.title)).toContain('Task 3');

            const incompleteTasks = taskManager.getTasks({ completed: false });
            expect(incompleteTasks.length).toBe(1);
            expect(incompleteTasks[0].completed).toBe(false);
            expect(incompleteTasks[0].title).toBe('Task 2');
        });

        it('should filter tasks by priority', () => {
            const highPriorityTasks = taskManager.getTasks({ priority: Priority.High });
            expect(highPriorityTasks.length).toBe(1);
            expect(highPriorityTasks[0].priority).toBe(Priority.High);
            expect(highPriorityTasks[0].title).toBe('Task 1');
        });

        it('should filter tasks by multiple criteria', () => {
            const highAndCompleted = taskManager.getTasks({ priority: Priority.High, completed: true });
            expect(highAndCompleted.length).toBe(1);
            expect(highAndCompleted[0].title).toBe('Task 1');

            const lowAndCompleted = taskManager.getTasks({ priority: Priority.Low, completed: true });
            expect(lowAndCompleted.length).toBe(0);
        });
    });
});
