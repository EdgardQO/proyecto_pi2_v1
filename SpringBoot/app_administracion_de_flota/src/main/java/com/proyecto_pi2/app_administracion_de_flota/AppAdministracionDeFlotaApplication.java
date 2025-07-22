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

	@Autowired // Inyecta el PasswordEncoder
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(AppAdministracionDeFlotaApplication.class, args);
		// Si usas la Opción 2 de abajo, no necesitas llamar a generatePasswordHash() aquí
	}

	// --- OPCIÓN 1: Usar @PostConstruct (se ejecuta después de que Spring inicializa los beans) ---
	// Este método se ejecutará automáticamente una vez cuando la aplicación inicie.
	@PostConstruct
	public void generatePasswordHashOnStartup() {
		String rawPassword = "password123"; // La contraseña en texto plano que quieres encriptar
		String encodedPassword = passwordEncoder.encode(rawPassword);
		System.out.println("--------------------------------------------------");
		System.out.println("Hash para '" + rawPassword + "': " + encodedPassword);
		System.out.println("--------------------------------------------------");
		// Puedes añadir más contraseñas si necesitas:
		// String rawPassword2 = "otra_contrasena";
		// String encodedPassword2 = passwordEncoder.encode(rawPassword2);
		// System.out.println("Hash para '" + rawPassword2 + "': " + encodedPassword2);
	}


	// --- OPCIÓN 2 (Alternativa si no quieres @PostConstruct): Llamar desde main (menos común para esto) ---
    /*
    public void generatePasswordHash() {
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        System.out.println("Hash para '" + rawPassword + "': " + encodedPassword);
    }
    */
	// Si eliges esta opción 2, tendrías que llamar a este método desde main:
	// public static void main(String[] args) {
	//     SpringApplication.run(AppAdministracionDeFlotaApplication.class, args);
	//     // Después de que la aplicación haya iniciado y los beans estén listos, puedes hacer algo así:
	//     // AppAdministracionDeFlotaApplication app = new AppAdministracionDeFlotaApplication();
	//     // app.passwordEncoder = // Necesitarías una forma de obtener el bean aquí, lo cual es más complejo.
	//     // Es por eso que @PostConstruct es más fácil para inyección.
	// }
}