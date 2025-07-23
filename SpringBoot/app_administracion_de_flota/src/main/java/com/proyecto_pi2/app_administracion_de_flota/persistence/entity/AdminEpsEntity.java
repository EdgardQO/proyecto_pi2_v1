package com.proyecto_pi2.app_administracion_de_flota.persistence.entity;

import com.fasterxml.jackson.annotation.JsonProperty; // ¡Asegúrate de importar esta anotación!
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "admin_eps")
@Getter
@Setter
@NoArgsConstructor
public class AdminEpsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin_eps", nullable = false)
    private Integer idAdminEps;

    // --- CAMBIO CLAVE AQUÍ ---
    @JsonProperty("id_eps") // Indica a Jackson que mapee el campo 'id_eps' del JSON a esta propiedad.
    @Column(name = "id_eps", nullable = false)
    private Integer idEps;
    // --- FIN CAMBIO ---

    @Column(nullable = false, length = 8, unique = true)
    private String dni;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(length = 9)
    private String telefono;

    @Column(nullable = false, length = 150, unique = true)
    private String correo; // Usado como username para login del admin de EPS

    @Column(nullable = false, length = 255) // Para contraseñas encriptadas
    private String contrasena;

    @Column(name = "ruta_foto", length = 200)
    private String rutaFoto;

    @Column(nullable = false, length = 10)
    private String estado; // e.g., "ACTIVO", "INACTIVO"

    @Column(name = "id_rol_sistema", nullable = false) // NUEVO: Columna para el rol de sistema
    private Integer idRolSistema;

    @ManyToOne
    @JoinColumn(name = "id_eps", referencedColumnName = "id_eps", insertable = false, updatable = false)
    private EpsEntity eps;

    @ManyToOne
    @JoinColumn(name = "id_rol_sistema", referencedColumnName = "id_rol_sistema", insertable = false, updatable = false)
    private RolSistemaEntity rolSistema; // Relación con RolSistemaEntity
}