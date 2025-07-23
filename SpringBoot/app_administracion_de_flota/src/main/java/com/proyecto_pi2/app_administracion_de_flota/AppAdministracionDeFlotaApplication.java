package com.proyecto_pi2.app_administracion_de_flota;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaRepositories
@EnableJpaAuditing
public class AppAdministracionDeFlotaApplication {

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(AppAdministracionDeFlotaApplication.class, args);
	}
	@PostConstruct
	public void generatePasswordHashOnStartup() {
		String rawPassword = "password123";
		String encodedPassword = passwordEncoder.encode(rawPassword);
		System.out.println("--------------------------------------------------");
		System.out.println("Hash para '" + rawPassword + "': " + encodedPassword);
		System.out.println("--------------------------------------------------");
	}

}