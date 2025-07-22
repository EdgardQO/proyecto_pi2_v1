package com.proyecto_pi2.app_administracion_de_flota.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rol_eps")
@Getter
@Setter
@NoArgsConstructor
public class RolEpsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol_eps", nullable = false)
    private Integer idRolEps;

    @Column(name = "nombre_rol", nullable = false, length = 100, unique = true)
    private String nombreRol;
}