package com.proyecto_pi2.app_administracion_de_flota.persistence.repository;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.RolEpsEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolEpsRepository extends ListCrudRepository<RolEpsEntity, Integer> {
    RolEpsEntity findByNombreRol(String nombreRol);
}