package com.example.duotec.repository;

import com.example.duotec.model.ProgressoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressoRepository extends JpaRepository<ProgressoUsuario, Long> {
    List<ProgressoUsuario> findByUsuarioId(Long usuarioId);
}
