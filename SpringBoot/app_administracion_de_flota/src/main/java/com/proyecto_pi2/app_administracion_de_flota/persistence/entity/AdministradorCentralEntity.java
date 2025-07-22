package com.proyecto_pi2.app_administracion_de_flota.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "administrador_central")
@Getter
@Setter
@NoArgsConstructor
public class AdministradorCentralEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin_central", nullable = false)
    private Integer idAdminCentral;

    @Column(nullable = false, length = 8, unique = true)
    private String dni;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(length = 9)
    private String telefono;

    @Column(nullable = false, length = 150, unique = true)
    private String correo; // Usado como username para login

    @Column(nullable = false, length = 255) // Para contraseñas encriptadas
    private String contrasena;

    @Column(name = "ruta_foto", length = 200)
    private String rutaFoto;

    @Column(nullable = false, length = 10)
    private String estado; // e.g., "ACTIVO", "INACTIVO"

    @Column(name = "id_rol_sistema", nullable = false) // NUEVO: Columna para el rol de sistema
    private Integer idRolSistema;

    @ManyToOne
    @JoinColumn(name = "id_rol_sistema", referencedColumnName = "id_rol_sistema", insertable = false, updatable = false)
    private RolSistemaEntity rolSistema; // Relación con RolSistemaEntity
}