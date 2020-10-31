import React from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import Category from "./Category";
import AddElement from "./AddElement";
import EditModal from "./EditModal";
import EditTaskForm from "./EditTaskForm";
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';

class App1 extends React.Component {
    constructor() {
        super();
        this.state = {
            categories: [],
            nameCategory: '',
            isAddCategory: true,
            isAddTask: true,
            currentCategoryId: '',
            isShowModal: false,
            task: undefined,
            loading: true,
            currentTasks: [],
            performers: [],
            performerActions: [],
        }
    }

    onChangeName = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    fetchCategories = async () => {
        const res = await axios.get("/category")
        if (res.data.status === 200) {
            this.setState({categories: res.data.categories, loading: false})
            await this.fetchTasks();
        }
    }

    saveCategory = async (e, nameCategory, categoryId) => {
        e.preventDefault();
        const res = categoryId
            ? await axios.patch(`/category/${categoryId}`, {nameCategory})
            : await axios.post("/category", this.state);
        this.setState({nameCategory: ''});
        if (res.data.status === 200) {
            !categoryId && this.onClickAddCategory();
            await this.fetchCategories();
        }
    }

    onSavePerformer = async (performer, taskId) => {
        performer.id
            ? await axios.patch(`/performer/${performer.id}`, {...performer, task_id: taskId})
            : await axios.post("/performer", {...performer, task_id: taskId})
    }

    onDeleteCategory = async (currentCategoryId) => {
        const category = _find(this.state.categories, ['id', currentCategoryId]);
        await category.tasks.map((task) => this.onDeleteTask(task));
        const res = await axios.delete(`/category/${currentCategoryId}`);
        if (res.data.status === 200) {
            await this.fetchCategories();
        }
    }

    onDeleteTask = async (task) => {
        await this.state.performers.map((performer) => this.onDeletePerformer(performer.id));
        await this.state.performerActions.map((performerAction) => this.onDeletePerformerAction(performerAction.id));
        await axios.delete(`/task/${task.id}`)
            .then((res) => {
                if (res.data.status === 200) {
                    this.setState({isShowModal: false, performers: [], performerActions: []});
                    this.fetchCategories();
                }
            });
    }

    onDeletePerformer = async (id) => {
        await axios.delete(`/performer/${id}`);
    }

    onDeletePerformerAction = async (id) => {
       await axios.delete(`/performerAction/${id}`);
    }

    onClickAddCategory = () => {
        this.setState({isAddCategory: !this.state.isAddCategory});
    }

    fetchTasks = async () => {
        const categories = this.state.categories.slice();
        await this.state.categories.map(category => {
            const index = this.state.categories
                .findIndex((item) => item.id === category.id);
            axios.get(`/category/${category.id}/tasks`)
                .then((res) => {
                    categories[index] = {
                        ...categories[index],
                        tasks: res.data.tasks,
                    }
                })
                .then(() => this.setState({categories}))
        })
    }

    fetchPerformers = async (task) => {
        return await axios.get(`/task/${task.id}/performers`)
    }

    fetchPerformerActions = async (task) => {
        return await axios.get(`/task/${task.id}/performerActions`)
    }

    onClickAddTask = async (task, currentCategoryId) => {
        if (task.id) {
            this.setState({task});
            await this.fetchPerformerActions(task).then((res) => {
                    this.setState({
                        performerActions: res.data.performerActions,
                    })
                }
            );
            await this.fetchPerformers(task).then((res) => {
                    this.setState({
                        isShowModal: !this.state.isShowModal,
                        performers: res.data.performers,
                        currentCategoryId
                    })
                }
            );
        } else {
            this.setState({
                isShowModal: !this.state.isShowModal,
                task: task || {},
                currentCategoryId
            })
        }
    }

    onSaveTask = async (task) => {
        const {id: taskId} = this.state.task;
        if (taskId) {
            this.state.performers.map((performer) => {
                const hasPerformer = _find(task.performers, ['id', performer.id])
                if (!hasPerformer) {
                    this.onDeletePerformer(performer.id)
                }
            })
            this.state.performerActions.map((performerAction) => {
                const hasPerformerAction = _find(task.performerActions, ['id', performerAction.id])
                if (!hasPerformerAction) {
                    this.onDeletePerformerAction(performerAction.id)
                }
            })
        }

        const res = taskId
            ? await axios.patch(`/task/${taskId}`, {...task, category_id: this.state.currentCategoryId})
            : await axios.post("/task", {...task, category_id: this.state.currentCategoryId});
        if (res.data.status === 200) {
            this.setState({
                isShowModal: false,
                performers: [],
                performerActions: [],
            });

            task.performers && task.performers.map((performer) => {
                this.onSavePerformer(performer, res.data.taskId)
            })
            task.performerActions && task.performerActions.map((performerAction) => {
                this.onSavePerformerAction(performerAction, res.data.taskId)
            })
            await this.fetchTasks();
        }
    }

    onSavePerformer = async (performer, taskId) => {
        performer.id
            ? await axios.patch(`/performer/${performer.id}`, {...performer, task_id: taskId})
            : await axios.post("/performer", {...performer, task_id: taskId})
    }

    onSavePerformerAction = async (performerAction, taskId) => {
        const isCompleted = (_isEqual(performerAction.isCompleted, ["on"])
            || _isEqual(performerAction.isCompleted, [1])) ? 1 : 0;

        const data = {...performerAction, task_id: taskId, isCompleted};
        const res = performerAction.id
            ? await axios.patch(`/performerAction/${performerAction.id}`, data)
            : await axios.post("/performerAction", data)
        if (res.data.status === 200) {}
    }

    componentDidMount() {
        this.fetchCategories();
    }

    render() {
        const {
            categories,
            nameCategory,
            isAddCategory,
            isShowModal,
            task,
            performers,
            performerActions
        } = this.state;
        const initValues = {...task, performers, performerActions};
        return (
            <div className="category-components container mt-5">
                {
                    categories.map((category) => (
                        <>
                            <Category
                                key={category.id}
                                category={category}
                                onClick={this.onClickAddTask}
                                isShowModal={isShowModal}
                                onDelete={this.onDeleteCategory}
                                onSaveName={this.saveCategory}
                            />
                        </>
                    ))
                }
                <AddElement
                    name={nameCategory}
                    save={this.saveCategory}
                    setName={this.onChangeName}
                    onClickAdd={this.onClickAddCategory}
                    isAdd={isAddCategory}
                />
                <EditModal
                    body={<EditTaskForm
                        initValues={initValues}
                        handleSubmit={this.onSaveTask}
                        onDelete={this.onDeleteTask}
                        onExit={() => this.setState({isShowModal: false, performers: [], performerActions: []})}
                    />}
                    isShowModal={isShowModal}
                />
            </div>
        );
    }
}

export default App1;

if (document.getElementById('app1')) {
    ReactDOM.render(<App1/>, document.getElementById('app1'));
}
