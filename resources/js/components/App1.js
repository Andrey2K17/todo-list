import React from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import Category from "./Category";
import AddElement from "./AddElement";
import EditModal from "./EditModal";
import EditTaskForm from "./EditTaskForm";

class App1 extends React.Component {
    constructor() {
        super();
        this.state = {
            categories: [],
            nameCategory: '',
            isAddCategory: true,
            isShowModal: false,
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
            this.setState({categories: res.data.categories})
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

    onDeleteCategory = async (id) => {
        const res = await axios.delete(`/category/${id}`);
        if (res.data.status === 200) {
            await this.fetchCategories();
        }
    }

    onDeleteTask = async (task) => {
        await axios.delete(`/task/${task.id}`)
            .then((res) => {
                if (res.data.status === 200) {
                    this.setState({isShowModal: false});
                    this.fetchCategories();
                }
            });
    }

    onClickAddCategory = () => {
        this.setState({isAddCategory: !this.state.isAddCategory});
    }

    onClickAddTask = async (task, categoryId) => {
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
        console.log('a', task);
        const res = task.id
            ? await axios.patch(`/task/${task.id}`, task)
            : await axios.post("/task", task);

        if (res.data.status === 200) {
            this.setState({isShowModal: false});
            await this.fetchCategories();
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
        } = this.state;
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
                                onDelete={() => this.onDeleteCategory(category.id)}
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
                    body={
                        <EditTaskForm
                            initValues={this.state.currentTask}
                            handleSubmit={this.onSaveTask}
                            onDelete={this.onDeleteTask}
                            onExit={() => this.setState({isShowModal: false, currentTask: {}})}
                        />
                    }
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
