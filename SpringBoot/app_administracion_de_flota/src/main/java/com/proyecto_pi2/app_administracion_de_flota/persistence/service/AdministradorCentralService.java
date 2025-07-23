package com.proyecto_pi2.app_administracion_de_flota.persistence.service;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdministradorCentralEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.AdministradorCentralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdministradorCentralService {
    private final AdministradorCentralRepository adminCentralRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdministradorCentralService(AdministradorCentralRepository adminCentralRepository, PasswordEncoder passwordEncoder) {
        this.adminCentralRepository = adminCentralRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdministradorCentralEntity> getAll() {
        return this.adminCentralRepository.findAll();
    }

    public AdministradorCentralEntity getByCorreo(String correo) {
        return this.adminCentralRepository.findByCorreo(correo);
    }

    public AdministradorCentralEntity save(AdministradorCentralEntity adminCentral) {
        if (adminCentral.getIdAdminCentral() == null) {
            adminCentral.setContrasena(passwordEncoder.encode(adminCentral.getContrasena()));
        } else {
            Optional<AdministradorCentralEntity> existingAdminOptional = adminCentralRepository.findById(adminCentral.getIdAdminCentral());
            if (existingAdminOptional.isPresent()) {
                AdministradorCentralEntity existingAdmin = existingAdminOptional.get();
                if (adminCentral.getContrasena() == null || adminCentral.getContrasena().isEmpty()) {
                    adminCentral.setContrasena(existingAdmin.getContrasena());
                } else {
                    adminCentral.setContrasena(passwordEncoder.encode(adminCentral.getContrasena()));
                }
            } else {
                if (adminCentral.getContrasena() != null && !adminCentral.getContrasena().isEmpty()) {
                    adminCentral.setContrasena(passwordEncoder.encode(adminCentral.getContrasena()));
                }
            }
        }
        return this.adminCentralRepository.save(adminCentral);
    }

    public void delete(Integer idAdminCentral) {
        this.adminCentralRepository.deleteById(idAdminCentral);
    }

    public boolean exists(Integer idAdminCentral) {
        return this.adminCentralRepository.existsById(idAdminCentral);
    }
}