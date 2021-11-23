import React from 'react';
import Table from './Table';
import axios from "axios";
import ModalAdd from './ModalAdd';
import ModalEdit from './ModalEdit';


class Form extends React.Component {
    //1. urutan render pertama
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            todo: "",
            location: "",
            note: "",
            selectedIdx: null,
            todoList: []
            //     {
            //         id: 1,
            //         date: "20/11/2021",
            //         todo: "Intro ReactJS",
            //         location: "https://media.istockphoto.com/photos/protective-face-masks-and-hand-sanitizers-on-the-desks-according-to-picture-id1290836478",
            //         note: "Prepare VSCode, Node js and CRA",
            //         status: "Done"
            //     }
            // ]
        }
    }
    // menjalankan sebuah fungsi, pertama kali saat component atau page react js di render
    // urutan 3
    componentDidMount() {
        // fungsi yang digunakan untuk melakukan request data pertama kali ke backend
        this.getData();
    }

    getData = () => {
        //Axios : melakukan request data ke back-end atau API
        axios.get(`http://localhost:2000/todoList`)
            .then((response) => {
                //Masuk kedalam then ketika berhasil mendapat response dari json-server
                console.log(response.data)
                //menyimpan data response kedalam state
                this.setState({ todoList: response.data })
            })
            .catch((err) => {
                // Masuk kedalam catch ketika gagal mendapat response dari json-server
                console.log(err)
            })
    }

    btSubmit = () => {
        let { date, todo, location, note } = this.state // destructure supaya tinggal dipanggil variablenya buat dipush
        //axios
        axios.post(`http://localhost:2000/todoList`, {
            date, todo, location, note, status: "on going"
        }).then((response) => {
            //memanggil data terbaru untuk memperbarui data pada state
            this.getData()
            this.setState({
                date: "",
                todo: "",
                location: "",
                note: ""
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    // btSubmit = () => {
    //     let { date, todo, location, note, todoList } = this.state // destructure supaya tinggal dipanggil variablenya buat dipush
    //     let temp = [...todoList]; //spread operator buat di breakdown isi dari array todolist
    //     temp.push ({
    //         id: temp.length + 1,
    //         date,
    //         todo,
    //         location,
    //         note,
    //         status: "Ongoing"
    //     })
    //     this.setState({ todoList: temp})
    // }



    btDelete = (index) =>{
        axios.delete(`http://localhost:2000/todoList/${this.state.todoList[index].id}`)
        .then((response)=>{
            console.log(response.data)
            this.getData()  
        }).catch((err)=>{
            console.log(err)
        })
    }
    // btDelete = (index) => {
    //     let temp = [...this.state.todoList]
    //     temp.splice(index, 1)
    //     this.setState({ todoList: temp })
    // }
    btEdit = (index) => {
        this.setState({ selectedIdx: index })
    }
    btSave = () => {
        let { date, todo, location, note, todoList, selectedIdx } = this.state
        console.log(date, todo, location, note)
        let editData = {
            date: date == "" ? todoList[selectedIdx].date : date,
            todo: todo == "" ? todoList[selectedIdx].todo : todo,
            location: location == "" ? todoList[selectedIdx].location : location,
            note: note == "" ? todoList[selectedIdx].note : note,
        }
        axios.patch(`http://localhost:2000/todoList/${todoList[selectedIdx].id}`, editData)
        .then((response)=>{
            this.getData()
            this.setState({
                date: "",
                todo: "",
                location: "",
                note: "",
                selectedIdx:null
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    printData = () => {
        return this.state.todoList.map((value, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td>{value.date}</td>
                    <td>{value.todo}</td>
                    <td><img src={value.location} width="50%" alt="..." /></td>
                    <td>{value.note}</td>
                    <td>{value.status}</td>
                    <td>
                        <button className="btn btn-danger" type="button" onClick={() => this.btDelete(index)}>Delete</button>
                        <button className="btn btn-warning" type="button" onClick={() => this.btEdit(index)} data-toggle="modal" data-target="#editModal">Edit</button>
                    </td>
                </tr>
            )
        })
    }

    // printData = () => {
    //     return this.state.todoList.map((value, index) => {
    //         return (
    //             <tr>
    //                 <td>{index + 1}</td>
    //                 <td>{value.date}</td>
    //                 <td>{value.todo}</td>
    //                 <td><img src={value.location} width="50%" alt="..." /></td>
    //                 <td>{value.note}</td>
    //                 <td>{value.status}</td>
    //                 <td>
    //                     <button className="btn btn-danger" type="button" onClick={() => this.btDelete(index)}>Delete</button>
    //                     <button className="btn btn-warning" type="button" onClick={() => this.btEdit(index) } data-toggle="modal" data-target="#exampleModal">Edit</button>
    //                 </td>
    //             </tr>
    //         )
    //     })
    // }
    // printData = () => {
    //     return this.state.todoList.map((value, index) => {
    //         return (
    //             <tr>
    //                 <td>{index + 1}</td>
    //                 <td>{value.date}</td>
    //                 <td>{value.todo}</td>
    //                 <td><img src={value.location} width="50%" alt="..." /></td>
    //                 <td>{value.note}</td>
    //                 <td>{value.status}</td>
    //                 <td>
    //                     <button className="btn btn-danger" type="button" onClick={()=>this.btDelete(index)}>Delete</button>
    //                     <button className="btn btn-warning" type="button" onClick={()=>this.btEdit(index)}>Edit</button>
    //                 </td>
    //             </tr>
    //         )
    //     })
    // }

    handleInput = (value, propState) => {
        console.log(value, propState)
        this.setState({ [propState]: value })
    }

    //2. urutan 2

    render() {
        //    console.log( this.posisi)
        return (
            <div className="m-auto p-4">
                <ModalAdd
                    handleInput={this.handleInput}
                    date={this.state.date}
                    todo={this.state.todo}
                    location={this.state.location}
                    note={this.state.note}
                    btSubmit={this.btSubmit}
                />


                {
                    this.state.todoList.length > 0 && this.state.selectedIdx != null ?
                        <ModalEdit
                            date={this.state.todoList[this.state.selectedIdx].date}
                            todo={this.state.todoList[this.state.selectedIdx].todo}
                            location={this.state.todoList[this.state.selectedIdx].location}
                            note={this.state.todoList[this.state.selectedIdx].note}
                            handleInput={this.handleInput}
                            btCancel={() => this.setState({ selectedIdx: null })}
                            btSave={this.btSave}
                        />
                        : null
                }

                {/* <ModalEdit
                    date={this.state.todoList[this.state.selectedIdx].date}
                    todo={this.state.todoList[this.state.selectedIdx].todo}
                    location={this.state.todoList[this.state.selectedIdx].location}
                    note={this.state.todoList[this.state.selectedIdx].note}
                    btCancel={()=>this.setState({selectedIdx:null})}
                /> */}
                {/* {
                    this.state.todoList.length > 0 && this.state.selectedIdx != null ?
                        <div className="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editModalLabel">Add Product</h5>
                                        <button type="button" className="btn btn-outline-secondary close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form >
                                            <div className="form-group">
                                                <label for="exampleInputPassword1">Date</label>
                                                <input type="date" className="form-control" id="exampleInputPassword1"
                                                    defaultValue={this.state.todoList[this.state.selectedIdx].date} onChange={(event) => this.props.handleInput(event.target.value, "date")}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label for="exampleInputPassword1">To Do</label>
                                                <input type="text" className="form-control" id="exampleInputPassword1"
                                                    defaultValue={this.state.todoList[this.state.selectedIdx].todo} onChange={(event) => this.props.handleInput(event.target.value, "todo")}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label for="exampleInputPassword1">Location</label>
                                                <input type="text" className="form-control" id="exampleInputPassword1"
                                                    defaultValue={this.state.todoList[this.state.selectedIdx].location} onChange={(event) => this.props.handleInput(event.target.value, "location")}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label for="exampleInputPassword1">Note</label>
                                                <textarea className="form-control" id="exampleInputPassword1"
                                                    defaultValue={this.state.todoList[this.state.selectedIdx].note} onChange={(event) => this.props.handleInput(event.target.value, "note")}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({ selectedIdx: null })}>Cancel</button>
                                        <button type="button" className="btn btn-primary" >Save</button>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                } */}

                <Table cetak={this.printData()}>
                    {this.printData()}
                </Table>
                {/* </div> */}
            </div>
        );
    }
}



// render() {
//     return (
//         <div className="m-4">
//             <div className="d-flex justify-content-end">
//                 <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add Product</button>
//                 <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
//                                 <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                                     <span aria-hidden="true">&times;</span>
//                                 </button>
//                             </div>
//                             <div class="modal-body">
//                                 <div id="form" className="form-group" >

//                                     <p>Date</p>
//                                     <input className="form-control" id="date" type="date" ref="iptDate" value={this.state.date} onChange={(event) => this.handleInput(event.target.value, "date")} />
//                                     <p>To Do</p>
//                                     <input className="form-control" id="todo" type="text" ref="iptTodo" value={this.state.todo} onChange={(event) => this.handleInput(event.target.value, "todo")} />
//                                     <p>Location</p>
//                                     <input className="form-control" id="location" type="text" ref="iptLocation" value={this.state.location} onChange={(event) => this.handleInput(event.target.value, "location")} />
//                                     <p>Note</p>
//                                     <textarea className="form-control" id="note" type="text" ref="iptNote" value={this.state.note} onChange={(event) => this.handleInput(event.target.value, "note")} ></textarea>
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
//                                 <button type="button" className="btn btn-primary" onClick={this.btSubmit}>Save changes</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 </div>
//                 <div className="container-fluid">
//                     <Table cetak={this.printData()} />
//                 </div>
//             </div>
//         );
//     }
// }


export default Form;
//     render() {
//         //    console.log( this.posisi)
//         return (
//             <div className="row m-auto p-4">
//                 <form className="col-md-2">
//                     <div className="form-group">
//                         <label for="exampleInputPassword1">Date</label>
//                         <input type="date" className="form-control" id="exampleInputPassword1" onChange={(event) => this.handleInput(event.target.value, "date")} />
//                     </div>
//                     <div className="form-group">
//                         <label for="exampleInputPassword1">To Do</label>
//                         <input type="text" className="form-control" id="exampleInputPassword1" onChange={(event) => this.handleInput(event.target.value, "todo")} />
//                     </div>
//                     <div className="form-group">
//                         <label for="exampleInputPassword1">Location</label>
//                         <input type="text" className="form-control" id="exampleInputPassword1" onChange={(event) => this.handleInput(event.target.value, "location")}/>
//                     </div>
//                     <div className="form-group">
//                         <label for="exampleInputPassword1">Note</label>
//                         <textarea className="form-control" id="exampleInputPassword1" onChange={(event) => this.handleInput(event.target.value, "note")}/>
//                     </div>
//                     <button type='button' className="btn btn-primary" onClick={this.btSubmit}>Submit</button>
//                 </form>
//                 <div className="col-md-10">
//                     <Table cetak={this.printData()}>
//                         {this.printData()}
//                     </Table>
//                 </div>
//             </div>
//         );
//     }
// }


// export default Form;

// import React from 'react';
// import Table from './Table';

// class Form extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             todoList: [
//                 {
//                     id: 1,
//                     todo: "Intro ReactJS",
//                     date: "20/11/2021",
//                     location: "https://images.unsplash.com/photo-1637361875628-c8617fdda8db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
//                     note: "Prepare VSCode, Node js and CRA",
//                     status: "Done",
//                 }
//             ]
//         }
//     }

//     btSubmit = () => {
//         let toDoList=this.state.todoList
//         toDoList.push({
//             date:this.refs.date.value,
//             todo:this.refs.todo.value,
//             location:this.refs.location.value,
//             note:this.refs.note.value,
//             status:"Done"
//         })
//         this.setState({toDoList})
//     }

//     printData = () => {
//         return this.state.todoList.map((value, index) => {
//             return (
//                 <tr>
//                     <td>{index + 1}</td>
//                     <td>{value.date}</td>
//                     <td>{value.todo}</td>
//                     <td><img src={value.location} width="20%" alt="..." /></td>
//                     <td>{value.note}</td>
//                     <td>{value.status}</td>
//                 </tr>
//             )
//         })
//     }

//     render() {
//         return (
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col-2">
//                         <div className="d-flex flex-column justify-items-center">
//                             Date
//                             <input id="date" type="text" ref="date" placeholder="hh/bb/tttt" />
//                             To Do
//                             <input id="todo" type="text" ref="todo" />
//                             Location
//                             <input id="todo" type="text" ref="location" />
//                             Note
//                             <textarea name="note" id="note" cols="30" rows="10" ref="note"></textarea>
//                             <button className="btn btn-primary" onClick={this.btSubmit}>Submit</button>
//                         </div>
//                     </div>
//                     <div className="col-10">
//                         <Table cetak={this.printData()} />
//                 {/* ini disebut props utk manggil di childrennya, childrennya itu si Tabs. 
//                 si cetak= itu disebut dengan atribut, kita buat sendiri*/}
//                     </div>

//                 </div>
//             </div>
//         );
//     }
// }

// export default Form;