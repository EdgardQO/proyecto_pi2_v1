package com.proyecto_pi2.app_administracion_de_flota.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles_sistema")
@Getter
@Setter
@NoArgsConstructor
public class RolSistemaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol_sistema", nullable = false)
    private Integer idRolSistema;

    @Column(name = "nombre_rol", nullable = false, length = 100, unique = true)
    private String nombreRol;
}