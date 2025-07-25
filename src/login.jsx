import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Cambia esta contraseña por la que tú quieras
        const adminPassword = 'caquer_CASEWORLD';

        if (password === adminPassword) {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
        } else {
            alert('Contraseña incorrecta');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Acceso de Administrador</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
