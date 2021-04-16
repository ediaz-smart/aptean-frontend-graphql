import React from 'react';
import {loginAction} from '../actions/LoginAction';
import { connect } from 'react-redux';
import UserList from '../components/UserList';

class Login extends React.Component {
    constructor(props) {
        super(props);
        // defult state
        this.state = {
            email: ''
        };

        // bind custom fn
        // this.fn = this.fn.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    //life cycle
    // componentWillReceiveProps(nextProps) {
    //     const { email} = nextProps;
    //     console.log('todosreceve', email)
    // }

    //custom fn
    handleSubmit = async(e) => {
        const { loginAction } = this.props;
        const {email, password } = this.state;
        e.preventDefault();
        // debugger
        console.log('e', e);
        // let obj ={
        //     "email":"test"
        // }
       const resp = await loginAction(this.state);
       console.log('resp', resp)
        // .then(resp => {
        //     console.log('response', Response)
        // });
    }

    handleChange = (e) => {
        console.log('e', e.target)
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    //render
    render() {
        console.log('consponent')
        const { name } = this.state;
        const {email } = this.props;
        console.log('todoList', email)
        console.log('mname', name, 'this.state', this.state)
        return (
            <div>
            <h1>Arun</h1>
                <p>form</p>
                <form onSubmit={this.handleSubmit} >
                    <label>
                        Email:
    <input type="text" name="email" onChange={this.handleChange} />
                    </label>
                    <label>
                        password:
    <input type="password" name="password" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <UserList/>
            </div>
        )

    }
}

const mapState = (state) => ({
    email: state.todos.email
});

const mapDispatch = {
    // login : loginAction.login
    loginAction
}

export default connect(mapState, mapDispatch)(Login);