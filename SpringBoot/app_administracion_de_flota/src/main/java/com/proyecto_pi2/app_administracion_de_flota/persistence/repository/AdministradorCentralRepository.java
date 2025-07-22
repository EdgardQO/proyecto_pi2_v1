package com.proyecto_pi2.app_administracion_de_flota.persistence.repository;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdministradorCentralEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministradorCentralRepository extends ListCrudRepository<AdministradorCentralEntity, Integer> {
    AdministradorCentralEntity findByCorreo(String correo);
    // NUEVO: Método para buscar por DNI
    AdministradorCentralEntity findByDni(String dni);
}