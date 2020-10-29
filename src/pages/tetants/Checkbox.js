import React from 'react';
export default function (props) {
    return <div className="form-check">
        <input className="form-check-input" type="checkbox" checked={props.checked} onChange={(v)=>props.onChange(v.target.checked)}/>
        <label className="form-check-label">
            {props.label}
        </label>
    </div>
}