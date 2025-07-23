package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.AdminEpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional; // Necesario para findById

@Service
public class AdminEpsService {
    private final AdminEpsRepository adminEpsRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminEpsService(AdminEpsRepository adminEpsRepository, PasswordEncoder passwordEncoder) {
        this.adminEpsRepository = adminEpsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdminEpsEntity> getAll() {
        return this.adminEpsRepository.findAll();
    }

    public AdminEpsEntity getByCorreo(String correo) {
        return this.adminEpsRepository.findByCorreo(correo);
    }

    public AdminEpsEntity save(AdminEpsEntity adminEps) {
        if (adminEps.getIdAdminEps() == null) { // Es un nuevo administrador de EPS (POST)
            // Para nuevos administradores, la contraseña siempre se encripta.
            adminEps.setContrasena(passwordEncoder.encode(adminEps.getContrasena()));
        } else { // Es un administrador de EPS existente (PUT)
            // Obtener el administrador existente de la base de datos para preservar la contraseña si no se cambia
            Optional<AdminEpsEntity> existingAdminOptional = adminEpsRepository.findById(adminEps.getIdAdminEps());
            if (existingAdminOptional.isPresent()) {
                AdminEpsEntity existingAdmin = existingAdminOptional.get();
                // Si la contraseña en el objeto entrante está vacía o nula, mantener la contraseña existente
                if (adminEps.getContrasena() == null || adminEps.getContrasena().isEmpty()) {
                    adminEps.setContrasena(existingAdmin.getContrasena());
                } else {
                    // Si se proporciona una nueva contraseña, codificarla
                    adminEps.setContrasena(passwordEncoder.encode(adminEps.getContrasena()));
                }
            } else {
                // Lógica de fallback si el usuario con el ID no se encuentra (aunque el controller lo validaría)
                if (adminEps.getContrasena() != null && !adminEps.getContrasena().isEmpty()) {
                    adminEps.setContrasena(passwordEncoder.encode(adminEps.getContrasena()));
                }
            }
        }
        return this.adminEpsRepository.save(adminEps);
    }

    public void delete(Integer idAdminEps) {
        this.adminEpsRepository.deleteById(idAdminEps);
    }

    public boolean exists(Integer idAdminEps) {
        return this.adminEpsRepository.existsById(idAdminEps);
    }
}