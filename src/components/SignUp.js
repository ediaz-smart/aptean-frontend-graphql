import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import SignUpForm from './signUpForm';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        // defult state
        this.state = {
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
    
    submit = values => {
        // print the form values to the console
        console.log(values)
      }
      render() {
        return <SignUpForm onSubmit={this.submit} />
      }
}



export default SignUp;