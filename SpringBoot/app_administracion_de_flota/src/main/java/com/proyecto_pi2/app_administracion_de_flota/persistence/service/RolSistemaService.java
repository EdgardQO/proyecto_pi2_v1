package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.RolSistemaEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.RolSistemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolSistemaService {
    private final RolSistemaRepository rolSistemaRepository;

    @Autowired
    public RolSistemaService(RolSistemaRepository rolSistemaRepository) {
        this.rolSistemaRepository = rolSistemaRepository;
    }

    public List<RolSistemaEntity> getAllRolesSistema() {
        return this.rolSistemaRepository.findAll();
    }

    public RolSistemaEntity getRolSistemaByName(String nombreRol) {
        return this.rolSistemaRepository.findByNombreRol(nombreRol);
    }

    public RolSistemaEntity saveRolSistema(RolSistemaEntity rolSistema) {
        return this.rolSistemaRepository.save(rolSistema);
    }

    public void deleteRolSistema(Integer idRolSistema) {
        this.rolSistemaRepository.deleteById(idRolSistema);
    }

    public boolean exists(Integer idRolSistema) {
        return this.rolSistemaRepository.existsById(idRolSistema);
    }
}