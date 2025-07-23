package com.proyecto_pi2.app_administracion_de_flota.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario_por_eps")
@Getter
@Setter
@NoArgsConstructor
public class UsuarioPorEpsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_por_eps", nullable = false)
    private Integer idUsuarioPorEps;

    @Column(name = "id_rol_eps", nullable = false)
    private Integer idRolEps;

    @Column(name = "id_eps", nullable = false)
    private Integer idEps;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, length = 255)
    private String contrasena;

    @Column(nullable = false, length = 8, unique = true)
    private String dni;

    @Column(name = "ruta_foto", length = 200)
    private String rutaFoto;

    @Column(name = "area_usuario_caracter", length = 50)
    private String areaUsuarioCaracter;

    @Column(nullable = false, length = 10)
    private String estado;

    @Column(name = "id_rol_sistema", nullable = false)
    private Integer idRolSistema;

    @ManyToOne
    @JoinColumn(name = "id_rol_eps", referencedColumnName = "id_rol_eps", insertable = false, updatable = false)
    private RolEpsEntity rolEps;

    @ManyToOne
    @JoinColumn(name = "id_eps", referencedColumnName = "id_eps", insertable = false, updatable = false)
    private EpsEntity eps;

    @ManyToOne
    @JoinColumn(name = "id_rol_sistema", referencedColumnName = "id_rol_sistema", insertable = false, updatable = false)
    private RolSistemaEntity rolSistema;
}