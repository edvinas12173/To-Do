<template>
    <div class="col-12">
        <!-- To-Do Statistic -->
        <div class="card bg-dark text-white">
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-4">
                        <span class="h3" title="All tasks"><i class="fas fa-list-ul"></i> {{allToDoCount}}</span>
                    </div>
                    <div class="col-4">
                        <span class="h3" title="Completed tasks"><i class="fas fa-check"></i> {{completedToDoCount}}</span>
                    </div>
                    <div class="col-4">
                        <span class="h3" title="Tasks in progress"><i class="fas fa-spinner"></i> {{inProgressToDoCount}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- To-Do List Card -->
        <div class="card mt-2">
            <div class="card-header">
                To-Do list
                <button class="btn btn-sm btn-dark float-right" data-bs-toggle="modal" data-bs-target="#newToDo"><i class="fas fa-plus"></i> Add a new To-Do</button>
            </div>
            <div class="card-body">
                <!-- Spinner -->
                <div class="d-flex justify-content-center" v-if="loading">
                    <div class="spinner-border" role="status"></div>
                </div>
                <!-- Error -->
                <div class="alert alert-danger" role="alert" v-if="errored">
                    Error of load data!
                </div>
                <!-- To-Do List -->
                <div v-if="allToDoCount == 0" class="card bg-white border-0 mb-2">
                    <div class="card-body">
                        <div class="alert alert-info" role="alert">
                            To-Do list is a empty!
                        </div>
                    </div>
                </div>
                <div v-else class="card mb-2" v-for="(todo, index) in todoForUser">
                    <div class="card-body" :class="{ 'text-white bg-success line-through': todo.is_done == true}">
                        <div class="px-3">
                            <input @change="isDone(todoList[index])" v-model="todoList[index].is_done" class="form-check-input" type="checkbox">
                            <span style="cursor: pointer;" @click="getTodo(todo.id)" data-bs-toggle="modal" data-bs-target="#viewTodo">{{todo.title}}</span>
                            <span class="float-right" :class="{ 'line-through': todo.is_done == true}">Due date: {{todo.due_at | formatDate}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Github profile link -->
        <div class="text-center mt-2">
            <a href="https://github.com/edvinas12173" class="text-dark"><i class="fab fa-github"></i> Github</a>
        </div>
        <!-- Current To-Do modal -->
        <div class="modal fade" id="viewTodo" tabindex="-1" aria-labelledby="viewTodoLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="viewTodoLabel">{{currentTodo.title}}</h5>
                        <span v-if="currentTodo.is_done == true" class="float-right text-success"><i class="fas fa-check"></i> Completed!</span>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <p>{{currentTodo.content}}</p>
                            </div>
                            <div class="col-12">
                                <small>Due date: {{currentTodo.due_at | formatDate}}</small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
                        <button type="button" @click="deleteTodo(currentTodo.id, currentTodo.title)" class="btn btn-danger" >Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- New To-Do Modal -->
        <div class="modal fade" id="newToDo" tabindex="-1" aria-labelledby="newToDo" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <form @submit.prevent="addNewTodo">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Title</label>
                                <input v-model="title" type="text" class="form-control" :class="{ 'is-invalid': $v.title.$error, 'is-valid': $v.title.required }" placeholder="Title">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Content</label>
                                <textarea v-model="content" class="form-control" :class="{ 'is-invalid': $v.content.$error, 'is-valid': $v.content.required }" rows="3" placeholder="Content"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Due date</label>
                                <input v-model="due_at" type="date" class="form-control" :class="{ 'is-invalid': $v.due_at.$error, 'is-valid': $v.due_at.required }">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="$v.$reset">Close</button>
                            <button type="submit" class="btn btn-success">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
        props: [
            'user_id'
        ],
        data() {
            return {
                errored: false,
                loading: true,
                todoList: [],
                todoUser: [],
                currentTodo: [],
                title: null,
                content: null,
                due_at: null,
                completed_at: null,
            }
        },
        mounted() {
            this.getAllTodo()
        },
        methods: {
            getAllTodo() {
                axios.get('/api/v1/todo-list')
                    .then(response => {
                        this.todoList = response.data.data
                    })
                    .catch(error => {
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            getTodo(id) {
                axios.get('/api/v1/todo-list/' + id)
                    .then(response => {
                        this.currentTodo = response.data.data
                    })
                    .catch(error => {
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            addNewTodo() {
                this.$v.$touch()
                if(this.$v.$anyError){
                    return;
                }
                axios.post('/api/v1/todo-list', {
                    user_id: this.user_id,
                    title: this.title,
                    content: this.content,
                    due_at: this.due_at,
                    completed_at: this.due_at,
                })
                    .then(response => {
                        this.$v.$reset()
                        this.title = ''
                        this.content = ''
                        this.due_at = ''
                        $("#newToDo").modal('hide');
                        this.$toaster.success('New a To-Do added!')
                        this.getAllTodo()
                    })
                    .catch(error => {
                        this.errored = true
                    })
            },
            isDone(todo) {
                axios.post('/api/v1/todo-list/'+todo.id, {
                    _method: 'PUT',
                    is_done: todo.is_done,
                })
                    .then(response => {
                        if(todo.is_done == true)
                            this.$toaster.success('Great, you completed!')
                    })
                    .catch(error => {
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    })

            },
            deleteTodo(id, title) {
                if(confirm('Are you sure delete '+title+'?')) {
                    axios.post('/api/v1/todo-list/' + id, {
                        _method: 'DELETE'
                    })
                        .then(response => {
                            $("#viewTodo").modal('hide');
                            this.$toaster.error('To-Do deleted!')
                            this.getAllTodo()
                        })
                        .catch(error => {
                            this.errored = true
                        })
                        .finally(() => {
                            this.loading = false
                        })
                }
            },
        },
        computed: {
            todoForUser: function () {
                let todoUserID = this.user_id
                return this.todoList.filter(function (todoUser) {
                    return todoUser.user_id == todoUserID;
                });
            },
            allToDoCount: function() {
                return this.todoForUser.length;
            },
            completedToDoCount: function() {
                return this.todoForUser.filter(todoForUser => todoForUser.is_done == true).length;
            },
            inProgressToDoCount: function() {
                return this.todoForUser.filter(todoForUser => todoForUser.is_done == false).length;
            },
        },
        validations: {
            title: {
                required,
            },
            content: {
                required,
            },
            due_at: {
                required,
            }
        },
    }
</script>

