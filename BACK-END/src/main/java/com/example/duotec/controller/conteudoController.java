package com.example.duotec.controller;

import com.example.duotec.model.Conteudo;
import com.example.duotec.repository.ConteudoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conteudos")
@CrossOrigin(origins = "*")
public class conteudoController {
    @Autowired
    private ConteudoRepository conteudoRepository;

    @GetMapping
    public List<Conteudo> listarTodos(){
        return conteudoRepository.findAll();
    }

    @PostMapping
    public Conteudo criarConteudo(@RequestBody Conteudo conteudo){
        return conteudoRepository.save(conteudo);
    }
}
