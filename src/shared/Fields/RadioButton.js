import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';

export default function RadioButton(props) {
    const { value, name, checked } = props;
    // const [selectedValue, setSelectedValue] = React.useState('a');

    // const handleChange = (event) => {
    //     setSelectedValue(event.target.value);
    // };

    return (

        <Radio
            checked={checked}
            // onChange={handleChange}
            value={value}
            color="default"
            name={name}
            inputProps={{ 'aria-label': 'D' }}
        />
    );
}
