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
});
