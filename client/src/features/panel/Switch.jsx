import React from 'react';
import './Switch.css';

const Switch = ({toggleFn, value}) => {
    return (
        <div>
            <label className='switch'>
                <input type="checkbox" value={value} onChange={toggleFn} />
                <span className="slider round"></span>
            </label>
        </div>
    )
}

export default Switch;