import React, { useEffect, useState } from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';


function Catalogo() {
    const [productos, setProductos] = useState([]);
    const [expandido, setExpandido] = useState(null); //ID del producto expandido
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroMarca, setFiltroMarca] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('');


    useEffect(() => {
        // Obtener productos
        fetch(`http://localhost:1980/productos`)
            .then((res) => res.json())
            .then((data) => {
                setProductos(data.productos || data);
            })
            .catch((err) => console.error('Error al obtener productos: ', err));

        // Obtener marcas
        fetch('http://localhost:1980/productos/marcas')
            .then(res => res.json())
            .then(data => setMarcas(data))
            .catch(err => console.error('Error al obtener marcas:', err));

        // Obtener categorías
        fetch('http://localhost:1980/productos/categorias')
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error('Error al obtener categorías:', err));
    }, []);


    useEffect(() => {
        const query = new URLSearchParams();
        if (filtroMarca) query.append('marca', filtroMarca);
        if (filtroCategoria) query.append('categoria', filtroCategoria);
        if (filtroDisponibilidad) query.append('disponible', filtroDisponibilidad);

        fetch(`http://localhost:1980/productos?${query.toString()}`)
            .then(res => res.json())
            .then(data => setProductos(data.productos || data))
            .catch(err => console.error('Error al filtrar productos:', err));
    }, [filtroMarca, filtroCategoria, filtroDisponibilidad]);


    const toggleExpandir = (id) => {
        setExpandido((prevID) => (prevID === id ? null : id));
    };

    return (
        <div className='container py-4'>
            {/* ENCABEZADO */}
            <div className='text-center mb-5'>
                <h1 className='fw-bold display-4'>CASE WORLD</h1>
                <a
                    href='https://www.instagram.com/caseworld24?igsh=MWJ1YzdtamI5dXl2Yg=='
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ fontSize: '1rem', color: '#888' }}
                >
                    Visítanos en Instagram
                </a>
            </div>

            {/* FILTROS */}
            <div className="row mb-4 g-3 justify-content-center">
                <div className="col-md-3">
                    <select className="form-select" value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)}>
                        <option value=''>Todas las marcas</option>
                        {marcas.map((m, i) => (
                            <option key={i} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                        <option value=''>Todas las categorías</option>
                        {categorias.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={filtroDisponibilidad} onChange={(e) => setFiltroDisponibilidad(e.target.value)}>
                        <option value=''>Todas</option>
                        <option value='true'>Disponible</option>
                        <option value='false'>No disponible</option>
                    </select>
                </div>
            </div>

            {/* CATÁLOGO DE PRODUCTOS */}
            <div className="row">
                {productos.map((prod) => (
                    <div key={prod.id} className="col-md-4 mb-4">
                        <div 
                            className="card h-100 shadow-sm" 
                            onClick={() => toggleExpandir(Number(prod.id))} 
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ width: '100%', height: '250px', overflow: 'hidden'}}>
                                <img 
                                    src={prod.imagen_url} 
                                    alt={prod.nombre} 
                                    className="img-fluid" 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} 
                                />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{prod.nombre}</h5>

                                {expandido === Number(prod.id) && (
                                    <div className="card-text">
                                        <p><strong>Marca:</strong> {prod.marca}</p>
                                        <p><strong>Categoría:</strong> {prod.categoria}</p>
                                        <p><strong>Precio:</strong> ${prod.precio}</p>
                                        <p>
                                            <strong>Disponibilidad:</strong>{' '}
                                            {prod.disponible ? 'Disponible' : 'No disponible'}
                                        </p>
                                        {/* Redes sociales */}
                                        <div className="mt-3 d-flex justify-content-around">
                                            <a href="https://www.instagram.com/caseworld24?igsh=MWJ1YzdtamI5dXl2Yg==" target="_blank" rel="noopener noreferrer">
                                                <FaInstagram size={24} color="#E1306C" />
                                            </a>
                                            <a href="https://wa.link/kh94zf" target="_blank" rel="noopener noreferrer">
                                                <FaWhatsapp size={24} color="#25D366" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalogo;