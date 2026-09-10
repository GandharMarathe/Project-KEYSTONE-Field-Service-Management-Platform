package com.zidio.keystone.config;

import com.zidio.keystone.security.JwtAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // User management: MANAGER only
                        .requestMatchers("/api/users/**").hasRole("MANAGER")

                        // Reports: management/dispatch only
                        .requestMatchers("/api/reports/**").hasAnyRole("MANAGER", "DISPATCHER")

                        // Parts catalog/inventory: writes restricted to management/dispatch
                        .requestMatchers(HttpMethod.POST, "/api/parts/**").hasAnyRole("MANAGER", "DISPATCHER")
                        .requestMatchers(HttpMethod.PUT, "/api/parts/**").hasAnyRole("MANAGER", "DISPATCHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/parts/**").hasAnyRole("MANAGER", "DISPATCHER")

                        // Customers & Sites: writes restricted to management/dispatch
                        .requestMatchers(HttpMethod.POST, "/api/customers/**", "/api/sites/**").hasAnyRole("MANAGER", "DISPATCHER")
                        .requestMatchers(HttpMethod.PUT, "/api/customers/**", "/api/sites/**").hasAnyRole("MANAGER", "DISPATCHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/customers/**", "/api/sites/**").hasAnyRole("MANAGER", "DISPATCHER")

                        // Work Orders: creation is management/dispatch only. PUT is also allowed to TECHNICIAN
                        // so they can move status on their own assigned job -- ownership and which fields they
                        // may change is enforced inside WorkOrderController, since that can't be expressed here.
                        // DELETE is management/dispatch only -- deletion is destructive, unlike a status update.
                        .requestMatchers(HttpMethod.POST, "/api/work-orders/**").hasAnyRole("MANAGER", "DISPATCHER")
                        .requestMatchers(HttpMethod.PUT, "/api/work-orders/**").hasAnyRole("MANAGER", "DISPATCHER", "TECHNICIAN")
                        .requestMatchers(HttpMethod.DELETE, "/api/work-orders/**").hasAnyRole("MANAGER", "DISPATCHER")

                        // Status history, Part Usage, Time Logs: any operational role logs their own work
                        .requestMatchers(HttpMethod.POST, "/api/work-order-status-history/**").hasAnyRole("MANAGER", "DISPATCHER", "TECHNICIAN")
                        .requestMatchers(HttpMethod.POST, "/api/part-usages/**").hasAnyRole("MANAGER", "DISPATCHER", "TECHNICIAN")
                        .requestMatchers(HttpMethod.POST, "/api/time-logs/**").hasAnyRole("MANAGER", "DISPATCHER", "TECHNICIAN")

                        // Everything else (all GETs, and anything not explicitly listed above) just requires
                        // being logged in. This is also where CUSTOMER read-only access lives -- there's no
                        // schema link from a CUSTOMER user to a specific Customer record to filter by, so it
                        // can only be gated at the endpoint level here, not restricted to "their own" data.
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}

