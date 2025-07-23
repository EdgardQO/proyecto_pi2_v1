package com.proyecto_pi2.app_administracion_de_flota.persistence.service;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.RolEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.RolEpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolEpsService {
    private final RolEpsRepository rolEpsRepository;

    @Autowired
    public RolEpsService(RolEpsRepository rolEpsRepository) {
        this.rolEpsRepository = rolEpsRepository;
    }

    public List<RolEpsEntity> getAllRolesEps() {
        return this.rolEpsRepository.findAll();
    }

    public RolEpsEntity getRolEpsByName(String nombreRol) {
        return this.rolEpsRepository.findByNombreRol(nombreRol);
    }

    public RolEpsEntity saveRolEps(RolEpsEntity rolEps) {
        return this.rolEpsRepository.save(rolEps);
    }

    public void deleteRolEps(Integer idRolEps) {
        this.rolEpsRepository.deleteById(idRolEps);
    }

    public boolean exists(Integer idRolEps) {
        return this.rolEpsRepository.existsById(idRolEps);
    }
}