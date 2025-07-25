import React, { useEffect, useState } from 'react';

function AdminPanel() {
    const [productos, setProductos] = useState([]);
    const [categoriaEsOtra, setCategoriaEsOtra] = useState(false);
    const [marcaEsOtra, setMarcaEsOtra] = useState(false);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [marcasDisponibles, setMarcasDisponibles] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        descripcion: '',
        categoria: '',
        marca: '',
        precio: '',
        imagen_url: '',
        disponible: true
    });

    //Cargar productos al iniciar
    useEffect(() => {
        //Cargar productos
        fetch('http://localhost:1980/productos')
            .then(res => res.json())
            .then(data => setProductos(data.productos || data))
            .catch(err => console.error('Error al cargar productos:', err));

        //Cargar marcas
        fetch('http://localhost:1980/productos/marcas')
            .then(res => res.json())
            .then(data => setMarcasDisponibles(data))
            .catch(err => console.error('Error al cargar marcas:', err));

        //Cargar categorías
        fetch('http://localhost:1980/productos/categorias')
            .then(res => res.json())
            .then(data => setCategoriasDisponibles(data))
            .catch(err => console.error('Error al cargar categorías:', err));
    }, []);

    //Validar la información que llega
    const validarFormulario = () => {
        if (!nuevoProducto.nombre.trim() ||
            !nuevoProducto.categoria.trim() ||
            !nuevoProducto.marca.trim() ||
            !nuevoProducto.precio.trim() ||
            !nuevoProducto.imagen_url.trim()) {
            alert("Todos los campos obligatorios deben estar completos.");
            return false;
        }

        if (isNaN(nuevoProducto.precio) || Number(nuevoProducto.precio) <= 0) {
            alert("El precio debe ser un número positivo.");
            return false;
        }

        const urlRegex = /^https?:\/\/.+/i;
        if (!urlRegex.test(nuevoProducto.imagen_url)) {
            alert("La URL de la imagen no es válida. Debe comenzar con http(s) y terminar en .jpg, .png, etc.");
            return false;
        }

        return true;
    };


    //Agregar nuevo producto
    const handleAgregar = (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        
        fetch('http://localhost:1980/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        })
            .then(res => res.json())
            .then(data => {
                alert('Producto agregado');
                setProductos([...productos, data.producto]);
                // Reset
                setNuevoProducto({
                    nombre: '',
                    descripcion: '',
                    categoria: '',
                    marca: '',
                    precio: '',
                    imagen_url: '',
                    disponible: true
                });
                setCategoriaEsOtra(false);
                setMarcaEsOtra(false);
            })
            .catch(err => console.error('Error al agregar producto:', err));
    };



    //Editar productos
    const handleEditarClick = (producto) => {
        setModoEdicion(true);
        setProductoEditando(producto);
        setNuevoProducto({ ...producto });
    };

    //Giardar edición
    const handleGuardarEdicion = (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        fetch(`http://localhost:1980/productos/${productoEditando.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(nuevoProducto)
        })
            .then(res => res.json())
            .then(data => {
                alert('Producto actualizado');
                setProductos(productos.map(p => p.id === productoEditando.id ? data.producto : p));
                //Reset
                setModoEdicion(false);
                setProductoEditando(null);
                setNuevoProducto({
                    nombre: '',
                    descripcion: '',
                    categoria: '',
                    marca: '',
                    precio: '',
                    imagen_url: '',
                    disponible: true
                });
                setCategoriaEsOtra(false);
                setMarcaEsOtra(false);
            })
            .catch(err => console.error('Error al editar producto:', err));
    };



    const handleEliminar = (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        fetch(`http://localhost:1980/productos/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                alert(data.mensaje || 'Producto eliminado');
                setProductos(productos.filter(p => p.id !== id));
            })
            .catch(err => console.error('Error al eliminar producto:', err));
    };

    
    return (
        <div className='container mt-4' /*style={{ padding: '20px' }}*/>
            <h2>Panel de Administración</h2>
            <button className='btn btn-danger float-end'
                onClick={() => {
                    localStorage.removeItem('isAdmin');
                    window.location.href = '/login';
                }}
                /*style={{
                    float: 'right',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}*/
                >
                Cerrar sesión
            </button>

            <form onSubmit={modoEdicion ? handleGuardarEdicion : handleAgregar} className='mb-4' /*style={{ marginBottom: '30px' }}*/>
                <h3 className='mb-3'>{modoEdicion ? 'Editar Producto' : 'Agregar Producto'}</h3>
                

                <div className='mb-3'>
                    <input type="text" placeholder="Nombre" required value={nuevoProducto.nombre} onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} />
                </div>
                

                <div className='mb-3'>
                    <input type="text" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} />
                </div>
              
                
                <div className='mb-3'>
                    <label className='form-label'>
                        Categoría:
                        <select className='form-select' required value={categoriaEsOtra ? 'otra' : nuevoProducto.categoria}
                        onChange={e => {
                            const value = e.target.value;
                            if (value === 'otra'){
                                setCategoriaEsOtra(true);
                                setNuevoProducto({ ...nuevoProducto, categoria: ''});
                            }else{
                                setCategoriaEsOtra(false);
                                setNuevoProducto({ ...nuevoProducto, categoria: value});
                            }
                        }} style={{width: '210px', padding: '1px'}}
                        >
                            <option value="">-- Selecciona una categoría --</option>
                            {categoriasDisponibles.map((cat, i) => (
                                <option key={i} value={cat}>{cat}</option>
                            ))}
                            <option value="otra">otra...</option>
                        </select>
                    </label>
                </div>


                {categoriaEsOtra && (
                    <div className='mb-3'>    
                        <input
                            type="text"
                            placeholder="Nueva categoría"
                            required
                            value={nuevoProducto.categoria}
                            onChange={e => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                        />
                    </div>
                )}


                <div className='mb-3'>
                    <label className='form-label'>
                        Marca:
                        <select className='form-select' required value={marcaEsOtra ? 'otra' : nuevoProducto.marca}
                            onChange={e => {
                                const value = e.target.value;
                                if (value === 'otra') {
                                    setMarcaEsOtra(true);
                                    setNuevoProducto({ ...nuevoProducto, marca: '' });
                                } else {
                                    setMarcaEsOtra(false);
                                    setNuevoProducto({ ...nuevoProducto, marca: value });
                                }
                            }} style={{ padding: '1px'}}
                        >
                            <option value="">-- Selecciona una marca --</option>
                            {marcasDisponibles.map((marca, i) => (
                                <option key={i} value={marca}>{marca}</option>
                            ))}
                            <option value="otra">Otra...</option>
                        </select>
                    </label>
                </div>


                {marcaEsOtra && (
                    <div className='mb-3'>
                        <input
                            type="text"
                            placeholder="Nueva marca"
                            required
                            value={nuevoProducto.marca}
                            onChange={e => setNuevoProducto({ ...nuevoProducto, marca: e.target.value })}
                        />
                    </div>
                )}

                
                <div className='mb-3'>
                    <input type="text" className='form-control' placeholder="Precio" required value={nuevoProducto.precio} onChange={e => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} />
                </div>
                

                <div className='mb-3'>
                    <input type="text" className='form-control' placeholder="URL de la Imagen" required value={nuevoProducto.imagen_url} onChange={e => setNuevoProducto({ ...nuevoProducto, imagen_url: e.target.value })} />
                </div>
                

                <div className='mb-3'>
                    <label className='form-label'>
                        Disponible:
                        <select className='form-select' value={nuevoProducto.disponible} onChange={e => setNuevoProducto({ ...nuevoProducto, disponible: e.target.value === 'true' })}>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </label>
                </div>

                <button type="submit" className='btn btn-primary' >{modoEdicion ? 'Guardar Cambios' : 'Agregar'}</button>
            </form>

            <h3>Productos actuales</h3>
            <ul className='list-group'>
                {productos.map((prod) => (
                    <li key={prod.id} className='list-group-item d-flex justify-content-between align-items-start'>
                        <div className='ms-2 me-auto'>
                            <div className='fw-bold'>{prod.nombre}</div> - {prod.marca} - {prod.categoria}
                                <br/>
                                <small>{prod.descripcion}</small>
                            </div>
                        <div>
                            <button onClick={() => handleEditarClick(prod)} className='btn btn-warning btn-sm me-2' /*style={{marginLeft: '10px'}}*/>Editar</button>
                            <button onClick={() => handleEliminar(prod.id)} className='btn btn-danger btn-sm' /*style={{ marginLeft: '10px', color: 'red' }}*/>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminPanel;