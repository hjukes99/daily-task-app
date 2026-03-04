import { Task, Priority } from './Task';

describe('Task Model', () => {
    it('should create a basic task with required fields', () => {
        const task = new Task({ id: '1', title: 'Buy groceries' });
        expect(task.id).toBe('1');
        expect(task.title).toBe('Buy groceries');
        expect(task.completed).toBe(false); // default value
        expect(task.description).toBeUndefined();
        expect(task.priority).toBeUndefined();
        expect(task.dueDate).toBeUndefined();
        expect(task.createdAt).toBeInstanceOf(Date);
    });

    it('should create a task with all fields provided', () => {
        const dueDate = new Date('2023-12-31');
        const task = new Task({
            id: '2',
            title: 'Finish project',
            description: 'Write code and run tests',
            completed: true,
            priority: Priority.High,
            dueDate: dueDate,
        });

        expect(task.id).toBe('2');
        expect(task.title).toBe('Finish project');
        expect(task.description).toBe('Write code and run tests');
        expect(task.completed).toBe(true);
        expect(task.priority).toBe(Priority.High);
        expect(task.dueDate).toBe(dueDate);
        expect(task.createdAt).toBeInstanceOf(Date);
    });

    it('should throw an error if id is missing', () => {
        expect(() => new Task({ id: '', title: 'Missing ID' })).toThrow('Task ID is required');
    });

    it('should throw an error if title is missing', () => {
        expect(() => new Task({ id: '3', title: '' })).toThrow('Task title is required');
    });

    describe('markComplete', () => {
        it('should mark a task as complete', () => {
            const task = new Task({ id: '1', title: 'Test Task' });
            expect(task.completed).toBe(false);
            task.markComplete();
            expect(task.completed).toBe(true);
        });
    });

    describe('markIncomplete', () => {
        it('should mark a task as incomplete', () => {
            const task = new Task({ id: '1', title: 'Test Task', completed: true });
            expect(task.completed).toBe(true);
            task.markIncomplete();
            expect(task.completed).toBe(false);
        });
    });

    describe('updateTitle', () => {
        it('should update the task title', () => {
            const task = new Task({ id: '1', title: 'Old Title' });
            task.updateTitle('New Title');
            expect(task.title).toBe('New Title');
        });

        it('should throw an error if new title is empty', () => {
            const task = new Task({ id: '1', title: 'Test Task' });
            expect(() => task.updateTitle('')).toThrow('Task title cannot be empty');
        });
    });
});
