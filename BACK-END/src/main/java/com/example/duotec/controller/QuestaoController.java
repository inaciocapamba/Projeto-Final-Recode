package com.example.duotec.controller;

import com.example.duotec.model.Questao;
import com.example.duotec.repository.QuestaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questoes")
@CrossOrigin(origins = "*")
public class QuestaoController {

    @Autowired
    private QuestaoRepository questaoRepository;

    @PostMapping
    public Questao criarQuestao(@RequestBody Questao questao){
        return questaoRepository.save(questao);
    }

    @GetMapping("/conteudo/{conteudoId}")
    public List<Questao> buscarPorConteudo(@PathVariable Long conteudoId){
        return questaoRepository.findByConteudoId(conteudoId);
    }

    @GetMapping("/conteudo")
    public  List<Questao> listarQuestoes(){
        return questaoRepository.findAll();
    }
}
