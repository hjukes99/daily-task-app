"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const TaskManager_1 = require("./models/TaskManager");
const Task_1 = require("./models/Task");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const taskManager = new TaskManager_1.TaskManager();
function displayMenu() {
    console.log('\n--- Daily Task App ---');
    console.log('1. List Tasks');
    console.log('2. Add Task');
    console.log('3. Complete Task');
    console.log('4. Delete Task');
    console.log('5. Exit');
    rl.question('Choose an option: ', handleMenuChoice);
}
function handleMenuChoice(choice) {
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
    }
    else {
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
                let priority;
                if (Object.values(Task_1.Priority).includes(priorityInput)) {
                    priority = priorityInput;
                }
                rl.question('Due Date (YYYY-MM-DD) [optional]: ', (dateInput) => {
                    let dueDate;
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.log(error.message);
        }
        displayMenu();
    });
}
// Start the application
displayMenu();
