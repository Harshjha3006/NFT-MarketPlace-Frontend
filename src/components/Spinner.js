import React from "react";
import loading from '../img/loading.gif';
const Spinner = () => {
    return (
        <div className="text-center" style={{
            width: '100vw', height: '70vh', display: 'flex', justifyContent: 'center',
            alignItems: 'center'
        }}>
            <img src={loading} alt="loading gif"></img>
        </div>
    );
}
export default Spinner;