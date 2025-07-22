package com.proyecto_pi2.app_administracion_de_flota.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "eps")
@Getter
@Setter
@NoArgsConstructor
public class EpsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_eps", nullable = false)
    private Integer idEsp;

    @Column(name = "nombre_eps", nullable = false, length = 100, unique = true)
    private String nombreEps;

    @Column(nullable = false, length = 11, unique = true)
    private String ruc;

    @Column(length = 100)
    private String direccion;

    @Column(length = 9)
    private String telefono;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "usuario_creador")
    private Integer usuarioCreador; // ID del administrador central que creó esta EPS

    @Column(nullable = false, length = 10)
    private String estado; // e.g., "ACTIVO", "INACTIVO"

    @ManyToOne
    @JoinColumn(name = "usuario_creador", referencedColumnName = "id_admin_central", insertable = false, updatable = false)
    private AdministradorCentralEntity administradorCreador; // Relación con el administrador central
}