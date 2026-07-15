package com.example.duotec.repository;

import com.example.duotec.model.ProgressoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressoRepository extends JpaRepository<ProgressoUsuario, Long> {
    List<ProgressoUsuario> findByUsuarioId(Long usuarioId);

    Optional<ProgressoUsuario> findByUsuarioIdAndConteudoId(Long usuarioId, Long conteudoId);
}
