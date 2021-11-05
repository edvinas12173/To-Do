<?php

namespace Database\Factories;

use App\Models\Todo;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class TodoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Todo::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $date = Carbon::now();
        return [
            'title' => $this->faker->text(20),
            'content' => $this->faker->text(200),
            'user_id' => '1',
            'is_done' => rand(0, 1),
            'due_at' => $date,
        ];
    }
}
