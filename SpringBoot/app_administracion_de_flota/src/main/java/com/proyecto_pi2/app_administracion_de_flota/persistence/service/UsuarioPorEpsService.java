package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.UsuarioPorEpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioPorEpsService {
    private final UsuarioPorEpsRepository usuarioPorEpsRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioPorEpsService(UsuarioPorEpsRepository usuarioPorEpsRepository, PasswordEncoder passwordEncoder) {
        this.usuarioPorEpsRepository = usuarioPorEpsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioPorEpsEntity> getAll() {
        return this.usuarioPorEpsRepository.findAll();
    }

    public UsuarioPorEpsEntity getByDni(String dni) {
        return this.usuarioPorEpsRepository.findByDni(dni);
    }

    // ✅ NUEVO: Método para obtener todos los usuarios por el ID de la EPS
    public List<UsuarioPorEpsEntity> getUsuariosByEpsId(Integer idEps) {
        return this.usuarioPorEpsRepository.findByIdEps(idEps);
    }

    public UsuarioPorEpsEntity save(UsuarioPorEpsEntity usuarioPorEps) {
        // Codificar la contraseña antes de guardar
        usuarioPorEps.setContrasena(passwordEncoder.encode(usuarioPorEps.getContrasena()));
        return this.usuarioPorEpsRepository.save(usuarioPorEps);
    }

    public void delete(Integer idUsuarioPorEps) {
        this.usuarioPorEpsRepository.deleteById(idUsuarioPorEps);
    }

    public boolean exists(Integer idUsuarioPorEps) {
        return this.usuarioPorEpsRepository.existsById(idUsuarioPorEps);
    }
}