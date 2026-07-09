package com.example.duotec.controller;

import com.example.duotec.model.ProgressoUsuario;
import com.example.duotec.repository.ProgressoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/progresso")
@CrossOrigin(origins = "*")
public class ProgressoUsuarioController {
    @Autowired
    private ProgressoRepository progressoRepository;

    @PostMapping("/concluir")
    public ProgressoUsuario concluirLicao(@RequestBody ProgressoUsuario progresso){
        progresso.setConcluido(true);
        progresso.setDataConclusao(LocalDateTime.now());
        return progressoRepository.save(progresso);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<ProgressoUsuario> buscarProgressoDoUsuario(@PathVariable Long usuario){
        return progressoRepository.findByUsuarioId(usuario);
    }
}
