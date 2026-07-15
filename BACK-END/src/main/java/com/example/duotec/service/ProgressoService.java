package com.example.duotec.service;

import com.example.duotec.model.Conteudo;
import com.example.duotec.model.ProgressoUsuario;
import com.example.duotec.repository.ConteudoRepository;
import com.example.duotec.repository.ProgressoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProgressoService {
    @Autowired
    private ProgressoRepository progressoRepository;
    @Autowired
    private ConteudoRepository conteudoRepository;

    @Transactional
    public ProgressoUsuario concluirEAvancar(ProgressoUsuario progressoRecebido){
        progressoRecebido.setConcluido(true);
        progressoRecebido.setDataConclusao(LocalDateTime.now());
        ProgressoUsuario progressoSalvo = progressoRepository.save(progressoRecebido);

        Long proximoConteudoId = progressoRecebido.getConteudo().getId() + 1;
        Optional<Conteudo> proximoConteudo = conteudoRepository.findById(proximoConteudoId);

        if (proximoConteudo.isPresent()){
            Long usuarioId = progressoRecebido.getUsuario().getId();

            boolean jaExiste = progressoRepository.findByUsuarioIdAndConteudoId(usuarioId, proximoConteudoId).isPresent();

            if (!jaExiste){
                ProgressoUsuario novoProgresso = new ProgressoUsuario();
                novoProgresso.setUsuario(progressoRecebido.getUsuario());
                novoProgresso.setConteudo(proximoConteudo.get());
                novoProgresso.setConcluido(false);
                progressoRepository.save(novoProgresso);
            }
        }

        return progressoSalvo;
    }
}
