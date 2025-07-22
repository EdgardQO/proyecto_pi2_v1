package com.proyecto_pi2.app_administracion_de_flota.persistence.repository;


import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.RolSistemaEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolSistemaRepository extends ListCrudRepository<RolSistemaEntity, Integer> {
    RolSistemaEntity findByNombreRol(String nombreRol);
}