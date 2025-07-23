package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.EpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.AdminEpsRepository;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.EpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminEpsService {
    private final AdminEpsRepository adminEpsRepository;
    private final EpsRepository epsRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminEpsService(AdminEpsRepository adminEpsRepository, PasswordEncoder passwordEncoder, EpsRepository epsRepository) {
        this.adminEpsRepository = adminEpsRepository;
        this.passwordEncoder = passwordEncoder;
        this.epsRepository = epsRepository;
    }

    public List<AdminEpsEntity> getAll() {
        return this.adminEpsRepository.findAll();
    }

    public AdminEpsEntity getByCorreo(String correo) {
        return this.adminEpsRepository.findByCorreo(correo);
    }

    public AdminEpsEntity save(AdminEpsEntity adminEps) {
        System.out.println("DEBUG (Service): adminEps.getIdEps() = " + adminEps.getIdEps() + ", adminEps.getEps().getIdEps() = " + (adminEps.getEps() != null ? adminEps.getEps().getIdEps() : "null (EpsEntity object is null)")); // <-- Añade esta línea

        // ... (el resto del código de save, incluyendo la encriptación de contraseña y la lógica de adjuntar EpsEntity) ...
        // Tu código anterior lanzará la excepción en la línea 69, así que esta línea de debug debería aparecer justo antes.

        if (adminEps.getIdAdminEps() == null) {
            adminEps.setContrasena(passwordEncoder.encode(adminEps.getContrasena()));
        } else {
            Optional<AdminEpsEntity> existingAdminOptional = adminEpsRepository.findById(adminEps.getIdAdminEps());
            if (existingAdminOptional.isPresent()) {
                AdminEpsEntity existingAdmin = existingAdminOptional.get();
                if (adminEps.getContrasena() == null || adminEps.getContrasena().isEmpty()) {
                    adminEps.setContrasena(existingAdmin.getContrasena());
                } else {
                    adminEps.setContrasena(passwordEncoder.encode(adminEps.getContrasena()));
                }
            } else {
                if (adminEps.getContrasena() != null && !adminEps.getContrasena().isEmpty()) {
                    adminEps.setContrasena(passwordEncoder.encode(adminEps.getContrasena()));
                }
            }
        }

        if (adminEps.getIdEps() != null) { // Esta es la línea que estás depurando.
            Optional<EpsEntity> optionalEps = epsRepository.findById(adminEps.getIdEps());
            if (optionalEps.isPresent()) {
                adminEps.setEps(optionalEps.get());
            } else {
                // Manejar el caso donde el idEps no corresponde a una EPS existente.
            }
        } else {
            throw new IllegalArgumentException("El ID de EPS no puede ser nulo."); // Línea 69
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