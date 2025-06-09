<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task; // Correctly placed use statement

class CheckOverdueTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:check-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks for overdue tasks and updates their status.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $overdueTasks = Task::whereIn('status', ['pending', 'in_progress'])
                            ->where('due_date', '<', now())
                            ->get();

        foreach ($overdueTasks as $task) {
            $task->update(['status' => 'overdue']);
            $this->info("Task '{$task->title}' (ID: {$task->id}) marked as overdue.");
        }

        $this->info('Overdue tasks check completed.');
    }
}
