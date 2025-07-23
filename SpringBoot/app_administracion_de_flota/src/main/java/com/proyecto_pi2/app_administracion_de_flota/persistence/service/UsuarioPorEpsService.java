package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.UsuarioPorEpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional; // Necesario para findById

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

    public List<UsuarioPorEpsEntity> getUsuariosByEpsId(Integer idEps) {
        return this.usuarioPorEpsRepository.findByIdEps(idEps);
    }

    public UsuarioPorEpsEntity save(UsuarioPorEpsEntity usuarioPorEps) {
        if (usuarioPorEps.getIdUsuarioPorEps() == null) { // Es un nuevo usuario (POST)
            // Para nuevos usuarios, la contraseña siempre se encripta.
            usuarioPorEps.setContrasena(passwordEncoder.encode(usuarioPorEps.getContrasena()));
        } else { // Es un usuario existente (PUT)
            // Obtener el usuario existente de la base de datos para preservar la contraseña si no se cambia
            Optional<UsuarioPorEpsEntity> existingUserOptional = usuarioPorEpsRepository.findById(usuarioPorEps.getIdUsuarioPorEps());
            if (existingUserOptional.isPresent()) {
                UsuarioPorEpsEntity existingUser = existingUserOptional.get();
                // Si la contraseña en el objeto entrante está vacía o nula, mantener la contraseña existente
                if (usuarioPorEps.getContrasena() == null || usuarioPorEps.getContrasena().isEmpty()) {
                    usuarioPorEps.setContrasena(existingUser.getContrasena());
                } else {
                    // Si se proporciona una nueva contraseña, codificarla
                    usuarioPorEps.setContrasena(passwordEncoder.encode(usuarioPorEps.getContrasena()));
                }
            } else {
                // Esto es un caso anómalo si el controlador ya validó la existencia.
                // Para evitar un NullPointerException o una contraseña no encriptada si el flujo llega aquí inesperadamente,
                // se encripta la contraseña si se proporciona, o se deja como está si es nula (lo cual luego podría fallar si es nueva).
                // Idealmente, este else no debería ejecutarse si el controller funciona como se espera (ej. .exists() antes de .save() en PUT).
                if (usuarioPorEps.getContrasena() != null && !usuarioPorEps.getContrasena().isEmpty()) {
                    usuarioPorEps.setContrasena(passwordEncoder.encode(usuarioPorEps.getContrasena()));
                }
                // Si el usuario no existe y no se proporcionó contraseña, se asume que algo salió mal.
                // No hay una contraseña previa para mantener. La persistencia fallaría o la contraseña sería nula.
            }
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