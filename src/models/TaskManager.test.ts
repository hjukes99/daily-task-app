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
