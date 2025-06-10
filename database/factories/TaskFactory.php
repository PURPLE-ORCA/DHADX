<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userIds = User::pluck('id')->toArray();
        $status = $this->faker->randomElement(['pending', 'in_progress', 'completed', 'submitted', 'overdue']);
        $priority = $this->faker->randomElement(['low', 'medium', 'high', 'urgent']);
        $dueDate = $this->faker->dateTimeBetween('-1 month', '+3 months');
        $completedAt = null;
        $submittedAt = null;

        if ($status === 'completed' || $status === 'submitted') {
            $completedAt = $this->faker->dateTimeBetween('-2 months', 'now');
            $submittedAt = $this->faker->dateTimeBetween($completedAt, 'now');
        } elseif ($status === 'overdue') {
            $dueDate = $this->faker->dateTimeBetween('-3 months', '-1 day');
        }

        return [
            'title' => $this->faker->sentence(rand(3, 7)),
            'description' => $this->faker->paragraph(rand(2, 5)),
            'assignee_id' => $this->faker->randomElement($userIds),
            'assigner_id' => $this->faker->randomElement($userIds),
            'due_date' => $dueDate,
            'status' => $status,
            'priority' => $priority,
            'completed_at' => $completedAt,
            'submitted_at' => $submittedAt,
        ];
    }
}
