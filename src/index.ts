import * as readline from 'readline';
import { TaskManager } from './models/TaskManager';
import { Priority } from './models/Task';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const taskManager = new TaskManager();

function displayMenu() {
    console.log('\n--- Daily Task App ---');
    console.log('1. List Tasks');
    console.log('2. Add Task');
    console.log('3. Complete Task');
    console.log('4. Delete Task');
    console.log('5. Exit');
    rl.question('Choose an option: ', handleMenuChoice);
}

function handleMenuChoice(choice: string) {
    switch (choice.trim()) {
        case '1':
            listTasks();
            break;
        case '2':
            addTask();
            break;
        case '3':
            completeTask();
            break;
        case '4':
            deleteTask();
            break;
        case '5':
            console.log('Exiting...');
            rl.close();
            break;
        default:
            console.log('Invalid option. Please try again.');
            displayMenu();
            break;
    }
}

function listTasks() {
    const tasks = taskManager.getTasks();
    console.log('\n--- Tasks ---');
    if (tasks.length === 0) {
        console.log('No tasks available.');
    } else {
        tasks.forEach(task => {
            const status = task.completed ? '[x]' : '[ ]';
            const priority = task.priority ? `(${task.priority})` : '';
            const dueDate = task.dueDate ? `[Due: ${task.dueDate.toDateString()}]` : '';
            console.log(`${task.id}. ${status} ${task.title} ${priority} ${dueDate}`);
            if (task.description) {
                console.log(`   Description: ${task.description}`);
            }
        });
    }
    displayMenu();
}

function addTask() {
    rl.question('Title: ', (title) => {
        if (!title.trim()) {
            console.log('Title is required.');
            return displayMenu();
        }
        rl.question('Description (optional): ', (description) => {
            rl.question('Priority (Low, Medium, High) [optional]: ', (priorityInput) => {
                let priority: Priority | undefined;
                if (Object.values(Priority).includes(priorityInput as Priority)) {
                    priority = priorityInput as Priority;
                }
                rl.question('Due Date (YYYY-MM-DD) [optional]: ', (dateInput) => {
                    let dueDate: Date | undefined;
                    if (dateInput.trim()) {
                        dueDate = new Date(dateInput);
                        if (isNaN(dueDate.getTime())) {
                            console.log('Invalid date format. Task created without due date.');
                            dueDate = undefined;
                        }
                    }
                    taskManager.createTask(title, description || undefined, priority, dueDate);
                    console.log('Task added successfully.');
                    displayMenu();
                });
            });
        });
    });
}

function completeTask() {
    rl.question('Enter Task ID to complete: ', (id) => {
        try {
            taskManager.editTask(id, { completed: true });
            console.log(`Task ${id} marked as complete.`);
        } catch (error: any) {
            console.log(error.message);
        }
        displayMenu();
    });
}

function deleteTask() {
    rl.question('Enter Task ID to delete: ', (id) => {
        try {
            taskManager.deleteTask(id);
            console.log(`Task ${id} deleted.`);
        } catch (error: any) {
            console.log(error.message);
        }
        displayMenu();
    });
}

// Start the application
displayMenu();
