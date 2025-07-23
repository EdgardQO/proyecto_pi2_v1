import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminEpsForm from './AdminEpsForm';
import EpsForm from './EpsForm';
import UserEpsForm from './UserEpsForm';
import './AdminCentral.css';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                {children}
            </div>
        </div>
    );
};

function AdminEpsFormModal({ isOpen, onClose, ...props }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <AdminEpsForm {...props} onCancel={onClose} />
        </Modal>
    );
}

function EpsFormModal({ isOpen, onClose, ...props }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <EpsForm {...props} onCancel={onClose} />
        </Modal>
    );
}

function UserEpsFormModal({ isOpen, onClose, ...props }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <UserEpsForm {...props} onCancel={onClose} />
        </Modal>
    );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, message, confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="confirmation-modal-content">
            <h3>Confirmación</h3>
            <p>{message}</p>
            <div className="confirmation-modal-actions">
                <button className="secondary-button" onClick={onConfirm}>{confirmText}</button>
                <button className="cancel-button" onClick={onClose}>{cancelText}</button>
            </div>
        </Modal>
    );
}


function AdminCentralDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('adminEps');

    const [adminEpsList, setAdminEpsList] = useState([]);
    const [loadingAdminEps, setLoadingAdminEps] = useState(true);
    const [errorAdminEps, setErrorAdminEps] = useState(null);
    const [isAdminEpsFormModalOpen, setIsAdminEpsFormModalOpen] = useState(false);
    const [currentAdminEps, setCurrentAdminEps] = useState(null);
    const [adminEpsToDeleteId, setAdminEpsToDeleteId] = useState(null);
    const [isDeleteAdminEpsModalOpen, setIsDeleteAdminEpsModalOpen] = useState(false);


    // Estados para la gestión de EPS
    const [epsList, setEpsList] = useState([]);
    const [loadingEpsList, setLoadingEpsList] = useState(true);
    const [errorEpsList, setErrorEpsList] = useState(null);
    const [isEpsFormModalOpen, setIsEpsFormModalOpen] = useState(false); // CAMBIO: Usar estado para modal
    const [currentEps, setCurrentEps] = useState(null);
    const [epsToDeleteId, setEpsToDeleteId] = useState(null); // Para modal de confirmación
    const [isDeleteEpsModalOpen, setIsDeleteEpsModalOpen] = useState(false);


    // Estados para la gestión de Usuarios por EPS (globalmente)
    const [usuariosEpsGlobalList, setUsuariosEpsGlobalList] = useState([]);
    const [loadingUsuariosEpsGlobal, setLoadingUsuariosEpsGlobal] = useState(true);
    const [errorUsuariosEpsGlobal, setErrorUsuariosEpsGlobal] = useState(null);
    const [isUserEpsFormModalOpen, setIsUserEpsFormModalOpen] = useState(false); // CAMBIO: Usar estado para modal
    const [currentUserEpsGlobal, setCurrentUserEpsGlobal] = useState(null);
    const [userEpsToDeleteId, setUserEpsToDeleteId] = useState(null); // Para modal de confirmación
    const [isDeleteUserEpsModalOpen, setIsDeleteUserEpsModalOpen] = useState(false);


    // Estados compartidos para formularios (roles y opciones de EPS)
    const [rolesSistema, setRolesSistema] = useState([]);
    const [adminEpsRoleId, setAdminEpsRoleId] = useState(null);
    const [usuarioEpsRoleId, setUsuarioEpsRoleId] = useState(null);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [epsOptions, setEpsOptions] = useState([]);
    const [loadingEpsOptions, setLoadingEpsOptions] = useState(true);
    const [rolesEpsOptions, setRolesEpsOptions] = useState([]);

    const [formMessage, setFormMessage] = useState('');
    const [formError, setFormError] = useState(false);

    // Estado y ref para el menú desplegable del usuario (si lo deseas en AdminCentral también)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Manejador para cerrar el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        fetchAdminEps();
        fetchEps();
        fetchUsuariosEpsGlobal();
        fetchRolesAndEpsOptions();
    }, []);

    // --- Funciones de Carga de Datos ---
    const fetchAdminEps = async () => {
        setLoadingAdminEps(true);
        setErrorAdminEps(null);
        try {
            const response = await axios.get('http://localhost:8080/api/admin-eps');
            setAdminEpsList(response.data);
        } catch (err) {
            console.error("Error al cargar administradores de EPS:", err);
            setErrorAdminEps("No se pudieron cargar los administradores de EPS.");
        } finally {
            setLoadingAdminEps(false);
        }
    };

    const fetchEps = async () => {
        setLoadingEpsList(true);
        setErrorEpsList(null);
        try {
            const response = await axios.get('http://localhost:8080/api/eps');
            setEpsList(response.data);
        } catch (err) {
            console.error("Error al cargar empresas EPS:", err);
            setErrorEpsList("No se pudieron cargar las empresas EPS. Asegúrate de tener el rol ADMIN_CENTRAL.");
        } finally {
            setLoadingEpsList(false);
        }
    };

    const fetchUsuariosEpsGlobal = async () => {
        setLoadingUsuariosEpsGlobal(true);
        setErrorUsuariosEpsGlobal(null);
        try {
            const response = await axios.get('http://localhost:8080/api/usuarios-eps');
            setUsuariosEpsGlobalList(response.data);
        } catch (err) {
            console.error("Error al cargar usuarios de EPS globalmente:", err);
            setErrorUsuariosEpsGlobal("No se pudieron cargar los usuarios de EPS globalmente. Asegúrate de tener el rol ADMIN_CENTRAL.");
        } finally {
            setLoadingUsuariosEpsGlobal(false);
        }
    };

    const fetchRolesAndEpsOptions = async () => {
        setLoadingRoles(true);
        setLoadingEpsOptions(true);
        try {
            const rolesSistemaResponse = await axios.get('http://localhost:8080/api/roles-sistema');
            setRolesSistema(rolesSistemaResponse.data);
            const adminEpsRol = rolesSistemaResponse.data.find(rol => rol.nombreRol === 'ADMIN_EPS');
            if (adminEpsRol) {
                setAdminEpsRoleId(adminEpsRol.idRolSistema);
            } else {
                console.warn("Rol 'ADMIN_EPS' no encontrado. No se podrán crear/editar Administradores EPS.");
                setFormMessage("Advertencia: El rol 'ADMIN_EPS' no está disponible en el backend.");
                setFormError(true);
                setAdminEpsRoleId(null);
            }
            const usuarioEpsRol = rolesSistemaResponse.data.find(rol => rol.nombreRol === 'USUARIO_EPS');
            if (usuarioEpsRol) {
                setUsuarioEpsRoleId(usuarioEpsRol.idRolSistema);
            } else {
                console.warn("Rol 'USUARIO_EPS' no encontrado.");
                setFormMessage("Advertencia: El rol 'USUARIO_EPS' no está disponible en el backend.");
                setFormError(true);
                setUsuarioEpsRoleId(null);
            }

            const rolesEpsResponse = await axios.get('http://localhost:8080/api/roles-eps');
            setRolesEpsOptions(rolesEpsResponse.data);

        } catch (error) {
            console.error("Error al cargar roles del sistema:", error);
            setFormMessage("Error al cargar roles del sistema para el formulario.");
            setFormError(true);
        } finally {
            setLoadingRoles(false);
        }

        try {
            const epsResponse = await axios.get('http://localhost:8080/api/eps');
            setEpsOptions(epsResponse.data);
        } catch (error) {
            console.error("Error al cargar opciones de EPS:", error);
            setFormMessage("Error al cargar las opciones de EPS para el formulario.");
            setFormError(true);
        } finally {
            setLoadingEpsOptions(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- Funciones de Gestión de Admin EPS ---
    const handleAddAdminEpsClick = () => {
        setCurrentAdminEps(null);
        setIsAdminEpsFormModalOpen(true);
        setFormMessage('');
        setFormError(false);
    };

    const handleEditAdminEpsClick = (adminEpsToEdit) => {
        setCurrentAdminEps(adminEpsToEdit);
        setIsAdminEpsFormModalOpen(true);
        setFormMessage('');
        setFormError(false);
    };

    const confirmDeleteAdminEps = (idAdminEps) => {
        setAdminEpsToDeleteId(idAdminEps);
        setIsDeleteAdminEpsModalOpen(true);
    };

    const handleDeleteAdminEpsConfirmed = async () => {
        setIsDeleteAdminEpsModalOpen(false);
        if (adminEpsToDeleteId) {
            try {
                await axios.delete(`http://localhost:8080/api/admin-eps/${adminEpsToDeleteId}`);
                setFormMessage('Administrador de EPS eliminado exitosamente.');
                setFormError(false);
                fetchAdminEps();
            } catch (error) {
                console.error('Error al eliminar Administrador de EPS:', error);
                setFormMessage(`Error al eliminar Administrador de EPS: ${error.response?.data?.message || error.message}`);
                setFormError(true);
            } finally {
                setAdminEpsToDeleteId(null);
            }
        }
    };

    const handleAdminEpsFormSubmit = async (formData) => {
        setFormMessage('');
        setFormError(false);
        try {
            if (currentAdminEps) {
                await axios.put('http://localhost:8080/api/admin-eps', formData);
                setFormMessage('Administrador de EPS actualizado exitosamente.');
            } else {
                await axios.post('http://localhost:8080/api/admin-eps', formData);
                setFormMessage('Administrador de EPS añadido exitosamente.');
            }
            setFormError(false);
            setIsAdminEpsFormModalOpen(false);
            fetchAdminEps();
        } catch (error) {
            console.error('Error al guardar Administrador de EPS:', error);
            let errorMessage = 'Error desconocido al guardar Administrador de EPS.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.data || error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setFormMessage(`Error al guardar Administrador de EPS: ${errorMessage}`);
            setFormError(true);
        }
    };


    // --- Funciones de Gestión de EPS ---
    const handleAddEpsClick = () => {
        setCurrentEps(null);
        setIsEpsFormModalOpen(true);
        setFormMessage('');
        setFormError(false);
    };

    const handleEditEpsClick = (epsToEdit) => {
        setCurrentEps(epsToEdit);
        setIsEpsFormModalOpen(true);
        setFormMessage('');
        setFormError(false);
    };

    const confirmDeleteEps = (idEps) => {
        setEpsToDeleteId(idEps);
        setIsDeleteEpsModalOpen(true);
    };

    const handleDeleteEpsConfirmed = async () => {
        setIsDeleteEpsModalOpen(false);
        if (epsToDeleteId) {
            try {
                await axios.delete(`http://localhost:8080/api/eps/${epsToDeleteId}`);
                setFormMessage('EPS eliminada exitosamente.');
                setFormError(false);
                fetchEps();
            } catch (error) {
                console.error('Error al eliminar EPS:', error);
                setFormMessage(`Error al eliminar EPS: ${error.response?.data?.message || error.message}`);
                setFormError(true);
            } finally {
                setEpsToDeleteId(null);
            }
        }
    };

    const handleEpsFormSubmit = async (formData) => {
        setFormMessage('');
        setFormError(false);
        try {
            if (currentEps) {
                await axios.put('http://localhost:8080/api/eps', formData);
                setFormMessage('EPS actualizada exitosamente.');
            } else {
                await axios.post('http://localhost:8080/api/eps', formData);
                setFormMessage('EPS añadida exitosamente.');
            }
            setFormError(false);
            setIsEpsFormModalOpen(false);
            fetchEps();
        } catch (error) {
            console.error('Error al guardar EPS:', error);
            let errorMessage = 'Error desconocido al guardar EPS.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.data || error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setFormMessage(`Error al guardar EPS: ${errorMessage}`);
            setFormError(true);
        }
    };


    // --- Funciones de Gestión de Usuarios por EPS (global) ---
    const handleAddUserEpsClick = () => {
        setCurrentUserEpsGlobal(null);
        setIsUserEpsFormModalOpen(true);
        setFormMessage('');
        setFormError(false);
    };

    const handleEditUserEpsClick = (userToEdit) => {
        setCurrentUserEpsGlobal(userToEdit);
        setIsUserEpsFormModalOpen(true);
        setFormMessage('');
        setFormError(false);
    };

    const confirmDeleteUserEps = (idUsuarioPorEps) => {
        setUserEpsToDeleteId(idUsuarioPorEps);
        setIsDeleteUserEpsModalOpen(true);
    };

    const handleDeleteUserEpsConfirmed = async () => {
        setIsDeleteUserEpsModalOpen(false);
        if (userEpsToDeleteId) {
            try {
                await axios.delete(`http://localhost:8080/api/usuarios-eps/${userEpsToDeleteId}`);
                setFormMessage('Usuario de EPS eliminado exitosamente.');
                setFormError(false);
                fetchUsuariosEpsGlobal();
            } catch (error) {
                console.error('Error al eliminar usuario de EPS:', error);
                setFormMessage(`Error al eliminar usuario de EPS: ${error.response?.data?.message || error.message}`);
                setFormError(true);
            } finally {
                setUserEpsToDeleteId(null);
            }
        }
    };


    const handleUserEpsFormSubmit = async (formData) => {
        setFormMessage('');
        setFormError(false);
        try {
            if (currentUserEpsGlobal) {
                await axios.put('http://localhost:8080/api/usuarios-eps', formData);
                setFormMessage('Usuario de EPS actualizado exitosamente.');
            } else {
                await axios.post('http://localhost:8080/api/usuarios-eps', formData);
                setFormMessage('Usuario añadido exitosamente.');
            }
            setFormError(false);
            setIsUserEpsFormModalOpen(false); // Cierra el modal
            fetchUsuariosEpsGlobal();
        } catch (error) {
            console.error('Error al guardar usuario de EPS:', error);
            let errorMessage = 'Error desconocido al guardar usuario de EPS.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.data || error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setFormMessage(`Error al guardar usuario de EPS: ${errorMessage}`);
            setFormError(true);
        }
    };


    if (!user) {
        return <div>Acceso denegado.</div>;
    }

    return (
        <div className="admin-dashboard-container">
            <header className="dashboard-header">
                <h1>Panel de Administrador Central</h1>
                <div className={`user-menu-container ${isUserMenuOpen ? 'active' : ''}`} ref={userMenuRef}>
                    <button className="user-info-button" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                        <span>Hola, {user.fullName || user.username}</span>
                    </button>
                    {isUserMenuOpen && (
                        <div className="dropdown-menu">
                            <div className="user-roles">
                                Roles: {user.roles.join(', ')}
                            </div>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                            <button onClick={() => navigate('/')}>Ir a la página principal</button>
                        </div>
                    )}
                </div>
            </header>

            <main className="main-content">
                <section className="left-panel">
                    <div className="section-nav-buttons">
                        <button onClick={() => setActiveSection('adminEps')} className={activeSection === 'adminEps' ? 'active' : ''}>Gestión Administradores EPS</button>
                        <button onClick={() => setActiveSection('eps')} className={activeSection === 'eps' ? 'active' : ''}>Gestión EPS</button>
                        <button onClick={() => setActiveSection('usuariosEps')} className={activeSection === 'usuariosEps' ? 'active' : ''}>Gestión Usuarios EPS</button>
                    </div>

                    {formMessage && (
                        <p className={formError ? 'message-error' : 'message-success'}>
                            {formMessage}
                        </p>
                    )}

                    {activeSection === 'adminEps' && (
                        <div className="action-buttons-group">
                            <button
                                className="primary-button"
                                onClick={handleAddAdminEpsClick}
                                disabled={loadingRoles || adminEpsRoleId === null || loadingEpsOptions || epsOptions.length === 0}
                            >
                                Agregar Nuevo Administrador EPS
                            </button>
                            {(loadingRoles || loadingEpsOptions) && <p className="message-info">Cargando datos de configuración...</p>}
                            {(adminEpsRoleId === null || epsOptions.length === 0) && !loadingRoles && !loadingEpsOptions && (
                                <p className="message-warning">Advertencia: Datos de configuración incompletos. No podrás agregar administradores de EPS.</p>
                            )}
                        </div>
                    )}

                    {activeSection === 'eps' && (
                        <div className="action-buttons-group">
                            <button className="primary-button" onClick={handleAddEpsClick}>
                                Agregar Nueva EPS
                            </button>
                        </div>
                    )}

                    {activeSection === 'usuariosEps' && (
                        <div className="action-buttons-group">
                            <button
                                className="primary-button"
                                onClick={handleAddUserEpsClick}
                                disabled={loadingRoles || usuarioEpsRoleId === null || loadingEpsOptions || epsOptions.length === 0 || rolesEpsOptions.length === 0}
                            >
                                Agregar Nuevo Usuario EPS
                            </button>
                            {(loadingRoles || loadingEpsOptions || rolesEpsOptions.length === 0) && <p className="message-info">Cargando datos de configuración...</p>}
                            {(usuarioEpsRoleId === null || epsOptions.length === 0 || rolesEpsOptions.length === 0) && !loadingRoles && !loadingEpsOptions && (
                                <p className="message-warning">Advertencia: Datos de configuración incompletos. No podrás agregar usuarios de EPS.</p>
                            )}
                        </div>
                    )}
                </section>

                <section className="right-panel data-table-section">
                    {activeSection === 'adminEps' && (
                        <>
                            <h3>Lista de Administradores de EPS</h3>
                            {loadingAdminEps ? (
                                <p className="message-info">Cargando administradores de EPS...</p>
                            ) : errorAdminEps ? (
                                <p className="message-error">{errorAdminEps}</p>
                            ) : (
                                adminEpsList.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>DNI</th>
                                                <th>Nombres</th>
                                                <th>Apellidos</th>
                                                <th>Correo</th>
                                                <th>EPS</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adminEpsList.map(admin => (
                                                <tr key={admin.idAdminEps}>
                                                    <td>{admin.idAdminEps}</td>
                                                    <td>{admin.dni}</td>
                                                    <td>{admin.nombres}</td>
                                                    <td>{admin.apellidos}</td>
                                                    <td>{admin.correo}</td>
                                                    <td>{admin.eps?.nombreEps || 'N/A'}</td>
                                                    <td>{admin.estado}</td>
                                                    <td>
                                                        <div className="action-buttons-table">
                                                            <button className="edit-button" onClick={() => handleEditAdminEpsClick(admin)}>Editar</button>
                                                            <button className="delete-button" onClick={() => confirmDeleteAdminEps(admin.idAdminEps)}>Eliminar</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No hay administradores de EPS registrados.</p>
                                )
                            )}
                        </>
                    )}

                    {activeSection === 'eps' && (
                        <>
                            <h3>Lista de Empresas EPS</h3>
                            {loadingEpsList ? (
                                <p className="message-info">Cargando empresas EPS...</p>
                            ) : errorEpsList ? (
                                <p className="message-error">{errorEpsList}</p>
                            ) : (
                                epsList.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre EPS</th>
                                                <th>RUC</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {epsList.map(eps => (
                                                <tr key={eps.idEps}>
                                                    <td>{eps.idEps}</td>
                                                    <td>{eps.nombreEps}</td>
                                                    <td>{eps.ruc}</td>
                                                    <td>{eps.estado}</td>
                                                    <td>
                                                        <div className="action-buttons-table">
                                                            <button className="edit-button" onClick={() => handleEditEpsClick(eps)}>Editar</button>
                                                            <button className="delete-button" onClick={() => confirmDeleteEps(eps.idEps)}>Eliminar</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No hay empresas EPS registradas.</p>
                                )
                            )}
                        </>
                    )}

                    {activeSection === 'usuariosEps' && (
                        <>
                            <h3>Lista de Usuarios por EPS</h3>
                            {loadingUsuariosEpsGlobal ? (
                                <p className="message-info">Cargando usuarios por EPS...</p>
                            ) : errorUsuariosEpsGlobal ? (
                                <p className="message-error">{errorUsuariosEpsGlobal}</p>
                            ) : (
                                usuariosEpsGlobalList.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>DNI</th>
                                                <th>Nombres</th>
                                                <th>Apellidos</th>
                                                <th>EPS</th>
                                                <th>Rol EPS</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuariosEpsGlobalList.map(user => (
                                                <tr key={user.idUsuarioPorEps}>
                                                    <td>{user.idUsuarioPorEps}</td>
                                                    <td>{user.dni}</td>
                                                    <td>{user.nombres}</td>
                                                    <td>{user.apellidos}</td>
                                                    <td>{user.eps?.nombreEps || 'N/A'}</td>
                                                    <td>{user.rolEps?.nombreRol || 'N/A'}</td>
                                                    <td>{user.estado}</td>
                                                    <td>
                                                        <div className="action-buttons-table">
                                                            <button className="edit-button" onClick={() => handleEditUserEpsClick(user)}>Editar</button>
                                                            <button className="delete-button" onClick={() => confirmDeleteUserEps(user.idUsuarioPorEps)}>Eliminar</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No hay usuarios por EPS registrados.</p>
                                )
                            )}
                        </>
                    )}
                </section>
            </main>

            {/* Modales */}
            {adminEpsRoleId !== null && epsOptions.length > 0 && (
                <AdminEpsFormModal
                    isOpen={isAdminEpsFormModalOpen}
                    onClose={() => setIsAdminEpsFormModalOpen(false)}
                    adminEps={currentAdminEps}
                    onSubmit={handleAdminEpsFormSubmit}
                    adminEpsRoleId={adminEpsRoleId}
                    epsOptions={epsOptions}
                    message={formMessage}
                    isError={formError}
                />
            )}
            <ConfirmationModal
                isOpen={isDeleteAdminEpsModalOpen}
                onClose={() => setIsDeleteAdminEpsModalOpen(false)}
                onConfirm={handleDeleteAdminEpsConfirmed}
                message="¿Estás seguro de que quieres eliminar este Administrador de EPS? Esta acción no se puede deshacer."
            />

            <EpsFormModal
                isOpen={isEpsFormModalOpen}
                onClose={() => setIsEpsFormModalOpen(false)}
                eps={currentEps}
                onSubmit={handleEpsFormSubmit}
                message={formMessage}
                isError={formError}
            />
            <ConfirmationModal
                isOpen={isDeleteEpsModalOpen}
                onClose={() => setIsDeleteEpsModalOpen(false)}
                onConfirm={handleDeleteEpsConfirmed}
                message="¿Estás seguro de que quieres eliminar esta EPS? Esta acción no se puede deshacer."
            />

            {usuarioEpsRoleId !== null && epsOptions.length > 0 && rolesEpsOptions.length > 0 && (
                <UserEpsFormModal
                    isOpen={isUserEpsFormModalOpen}
                    onClose={() => setIsUserEpsFormModalOpen(false)}
                    user={currentUserEpsGlobal}
                    onSubmit={handleUserEpsFormSubmit}
                    idEpsOptions={epsOptions}
                    rolesEpsOptions={rolesEpsOptions}
                    usuarioEpsRoleId={usuarioEpsRoleId}
                    message={formMessage}
                    isError={formError}
                />
            )}
            <ConfirmationModal
                isOpen={isDeleteUserEpsModalOpen}
                onClose={() => setIsDeleteUserEpsModalOpen(false)}
                onConfirm={handleDeleteUserEpsConfirmed}
                message="¿Estás seguro de que quieres eliminar este Usuario de EPS? Esta acción no se puede deshacer."
            />
        </div>
    );
}

export default AdminCentralDashboard;