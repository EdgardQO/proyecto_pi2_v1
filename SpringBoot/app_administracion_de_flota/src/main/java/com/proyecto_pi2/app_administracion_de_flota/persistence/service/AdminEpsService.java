package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.AdminEpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional; // Importar Optional

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

    // ✅ MÉTODO CORREGIDO: Obtener AdminEpsEntity por DNI, devolviendo Optional
    public Optional<AdminEpsEntity> getByDni(String dni) {
        return Optional.ofNullable(this.adminEpsRepository.findByDni(dni));
    }

    public AdminEpsEntity save(AdminEpsEntity adminEps) {
        // Codificar la contraseña antes de guardar
        adminEps.setContrasena(passwordEncoder.encode(adminEps.getContrasena()));
        return this.adminEpsRepository.save(adminEps);
    }

    public void delete(Integer idAdminEps) {
        this.adminEpsRepository.deleteById(idAdminEps);
    }

    public boolean exists(Integer idAdminEps) {
        return this.adminEpsRepository.existsById(idAdminEps);
    }
}