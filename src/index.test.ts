import { spawn } from 'child_process';
import * as path from 'path';

describe('Daily Task App CLI', () => {
    // We execute the typescript file using ts-node to avoid needing a build step before running tests.
    const cliPath = path.resolve(__dirname, 'index.ts');

    it('should display the menu on startup', (done) => {
        const child = spawn('npx', ['ts-node', cliPath]);
        
        child.on('error', (err) => {
            done(err);
        });

        let output = '';
        child.stdout.on('data', (data) => {
            output += data.toString();
            try {
                if (output.includes('Choose an option: ')) {
                    expect(output).toContain('--- Daily Task App ---');
                    expect(output).toContain('1. List Tasks');
                    expect(output).toContain('5. Exit');
                    child.stdin.write('5\n');
                    child.stdin.end();
                }
            } catch (err) {
                child.kill();
                done(err);
            }
        });

        child.on('close', (code) => {
            try {
                expect(code).toBe(0);
                done();
            } catch (err) {
                done(err);
            }
        });
    }, 15000);

    it('should add a task, complete it, and delete it', (done) => {
        const child = spawn('npx', ['ts-node', cliPath]);

        child.on('error', (err) => {
            done(err);
        });

        let output = '';
        let step = 0;

        child.stdout.on('data', (data) => {
            output += data.toString();
            
            try {
                if (step === 0 && output.includes('Choose an option: ')) {
                    step = 1;
                    output = '';
                    child.stdin.write('2\n'); // Add Task
                } else if (step === 1 && output.includes('Title: ')) {
                    step = 2;
                    output = '';
                    child.stdin.write('My Test Task\n');
                } else if (step === 2 && output.includes('Description (optional): ')) {
                    step = 3;
                    output = '';
                    child.stdin.write('My Description\n');
                } else if (step === 3 && output.includes('Priority (Low, Medium, High) [optional]: ')) {
                    step = 4;
                    output = '';
                    child.stdin.write('High\n');
                } else if (step === 4 && output.includes('Due Date (YYYY-MM-DD) [optional]: ')) {
                    step = 5;
                    output = '';
                    child.stdin.write('\n'); // No due date
                } else if (step === 5 && output.includes('Choose an option: ')) {
                    step = 6;
                    output = '';
                    child.stdin.write('1\n'); // List Tasks
                } else if (step === 6 && output.includes('Choose an option: ')) {
                    expect(output).toContain('My Test Task');
                    expect(output).toContain('(High)');
                    expect(output).toContain('Description: My Description');
                    step = 7;
                    output = '';
                    child.stdin.write('3\n'); // Complete Task
                } else if (step === 7 && output.includes('Enter Task ID to complete: ')) {
                    step = 8;
                    output = '';
                    child.stdin.write('1\n'); // ID is 1
                } else if (step === 8 && output.includes('Choose an option: ')) {
                    expect(output).toContain('Task 1 marked as complete.');
                    step = 9;
                    output = '';
                    child.stdin.write('1\n'); // List tasks again to verify [x]
                } else if (step === 9 && output.includes('Choose an option: ')) {
                    expect(output).toContain('1. [x] My Test Task');
                    step = 10;
                    output = '';
                    child.stdin.write('4\n'); // Delete Task
                } else if (step === 10 && output.includes('Enter Task ID to delete: ')) {
                    step = 11;
                    output = '';
                    child.stdin.write('1\n'); // ID is 1
                } else if (step === 11 && output.includes('Choose an option: ')) {
                    expect(output).toContain('Task 1 deleted.');
                    step = 12;
                    output = '';
                    child.stdin.write('5\n'); // Exit
                    child.stdin.end();
                }
            } catch (err) {
                child.kill();
                done(err);
            }
        });

        child.on('close', (code) => {
            try {
                expect(code).toBe(0);
                done();
            } catch (err) {
                done(err);
            }
        });
    }, 15000); // Increased timeout to 15s because ts-node startup overhead
});