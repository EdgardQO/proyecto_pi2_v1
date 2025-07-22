package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.UsuarioPorEpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional; // Importar Optional

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

    public Optional<UsuarioPorEpsEntity> getByDni(String dni) { // ✅ CORREGIDO: Ahora devuelve Optional
        return Optional.ofNullable(this.usuarioPorEpsRepository.findByDni(dni));
    }

    // ✅ MÉTODO PRESENTE: Para obtener un usuario por su ID
    public Optional<UsuarioPorEpsEntity> getById(Integer idUsuarioPorEps) {
        return this.usuarioPorEpsRepository.findById(idUsuarioPorEps);
    }

    // ✅ MÉTODO PRESENTE: Para obtener todos los usuarios por el ID de la EPS
    public List<UsuarioPorEpsEntity> getUsuariosByEpsId(Integer idEps) {
        return this.usuarioPorEpsRepository.findByIdEps(idEps);
    }

    public UsuarioPorEpsEntity save(UsuarioPorEpsEntity usuarioPorEps) {
        // Solo codificar la contraseña si no está vacía o es un nuevo usuario
        if (usuarioPorEps.getContrasena() != null && !usuarioPorEps.getContrasena().isEmpty()) {
            usuarioPorEps.setContrasena(passwordEncoder.encode(usuarioPorEps.getContrasena()));
        } else if (usuarioPorEps.getIdUsuarioPorEps() != null && this.usuarioPorEpsRepository.existsById(usuarioPorEps.getIdUsuarioPorEps())) {
            // Si es una actualización y la contraseña está vacía, mantener la contraseña existente
            this.usuarioPorEpsRepository.findById(usuarioPorEps.getIdUsuarioPorEps()).ifPresent(existingUser -> {
                usuarioPorEps.setContrasena(existingUser.getContrasena());
            });
        }
        return this.usuarioPorEpsRepository.save(usuarioPorEps);
    }

    public void delete(Integer idUsuarioPorEps) {
        this.usuarioPorEpsRepository.deleteById(idUsuarioPorEps);
    }

    public boolean exists(Integer idUsuarioPorEps) {
        return this.usuarioPorEpsRepository.existsById(idUsuarioPorEps);
    }
}