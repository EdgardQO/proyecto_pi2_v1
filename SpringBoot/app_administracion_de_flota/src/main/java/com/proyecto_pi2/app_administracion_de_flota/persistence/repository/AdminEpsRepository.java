package com.proyecto_pi2.app_administracion_de_flota.persistence.repository;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminEpsRepository extends ListCrudRepository<AdminEpsEntity, Integer> {
    AdminEpsEntity findByCorreo(String correo);
    // NUEVO: Método para buscar por DNI
    AdminEpsEntity findByDni(String dni);
}