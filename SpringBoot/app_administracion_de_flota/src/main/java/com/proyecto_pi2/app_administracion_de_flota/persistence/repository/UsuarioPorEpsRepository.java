package com.proyecto_pi2.app_administracion_de_flota.persistence.repository;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List

@Repository
public interface UsuarioPorEpsRepository extends ListCrudRepository<UsuarioPorEpsEntity, Integer> {
    UsuarioPorEpsEntity findByDni(String dni);

    // ✅ NUEVO: Método para buscar usuarios por id_eps
    List<UsuarioPorEpsEntity> findByIdEps(Integer idEps);
}