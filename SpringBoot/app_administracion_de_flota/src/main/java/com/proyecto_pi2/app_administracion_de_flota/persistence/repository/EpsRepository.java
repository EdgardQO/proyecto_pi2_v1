package com.proyecto_pi2.app_administracion_de_flota.persistence.repository;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.EpsEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EpsRepository extends ListCrudRepository<EpsEntity, Integer> {
    EpsEntity findByRuc(String ruc);
    EpsEntity findByNombreEps(String nombreEps);
}