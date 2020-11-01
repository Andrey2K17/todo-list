import React from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import Category from "./Category";
import AddElement from "./AddElement";
import EditModal from "./EditModal";
import EditTaskForm from "./EditTaskForm";
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
            currentTask: {},
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
        const res = await axios.delete(`/category/${currentCategoryId}`);
        if (res.data.status === 200) {
            await this.fetchCategories();
        }
    }

    onDeleteTask = async (task) => {
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

    onClickAddTask = async (task, categoryId) => {
        console.log('cc', task)
        if (task.id) {
            await axios.get(`/task/${task.id}`)
                .then((res) => this.setState({
                        isShowModal: !this.state.isShowModal,
                        currentTask: {
                            id: task.id,
                            date: res.data.date,
                            performers: res.data.performers,
                            categoryId: res.data.category_id,
                            performerActions: res.data.performer_actions,
                        }
                    })
                );
        } else {
            this.setState({
                isShowModal: !this.state.isShowModal, currentTask: {categoryId},
            })
        }
    }

    onSaveTask = async (task) => {
        console.log('te', task);
        const res = task.id
            ? await axios.patch(`/task/${task.id}`, task)
            : await axios.post("/task", task);

        if (res.data.status === 200) {
            this.setState({isShowModal: false});
            await this.fetchCategories();
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
        if (res.data.status === 200) {
        }
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
            currentTask,
        } = this.state;
        console.log('currentTask', currentTask);
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
                        initValues={this.state.currentTask}
                        handleSubmit={this.onSaveTask}
                        onDelete={this.onDeleteTask}
                        onExit={() => this.setState({isShowModal: false, currentTask: {}})}
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
