import React from 'react'
import GQLogo from '../../assets/image/GenomeQuest.svg';

const logoStyle = {
    width: '200px',
    margin: '2px',
    display: 'block'
}

const GQLogoComponent = props => {
    return (
        <a href={props.toLink ? props.toLink : '#/home'} style={logoStyle}  >
            <img src={GQLogo} alt="GQLogo" />
        </a>
    )
}

export default GQLogoComponent