package com.example.duotec.controller;

import com.example.duotec.model.ProgressoUsuario;
import com.example.duotec.repository.ProgressoRepository;
import com.example.duotec.service.ProgressoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progresso")
@CrossOrigin(origins = "*")
public class ProgressoUsuarioController {
    @Autowired
    private ProgressoRepository progressoRepository;

    @Autowired
    private ProgressoService progressoService;

    @PostMapping("/concluir")
    public ProgressoUsuario concluirLicao(@RequestBody ProgressoUsuario progresso){
        return progressoService.concluirEAvancar(progresso);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<ProgressoUsuario> buscarProgressoDoUsuario(@PathVariable("usuarioId") Long usuarioId){
        return progressoRepository.findByUsuarioId(usuarioId);
    }
}
