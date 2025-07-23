package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.EpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.EpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EpsService {
    private final EpsRepository epsRepository;

    @Autowired
    public EpsService(EpsRepository epsRepository) {
        this.epsRepository = epsRepository;
    }

    public List<EpsEntity> getAll() {
        return this.epsRepository.findAll();
    }

    public EpsEntity getByRuc(String ruc) {
        return this.epsRepository.findByRuc(ruc);
    }

    public Optional<EpsEntity> getById(Integer id) {
        return this.epsRepository.findById(id);
    }

    public EpsEntity save(EpsEntity eps) {
        return this.epsRepository.save(eps);
    }

    public void delete(Integer idEps) {
        this.epsRepository.deleteById(idEps);
    }

    public boolean exists(Integer idEps) {
        return this.epsRepository.existsById(idEps);
    }
}