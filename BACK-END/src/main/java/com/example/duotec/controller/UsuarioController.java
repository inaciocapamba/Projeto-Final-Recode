package com.example.duotec.controller;

import com.example.duotec.model.LoginRequest;
import com.example.duotec.model.Usuario;
import com.example.duotec.repository.UsuarioRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario){
        if(usuarioRepository.findByEmail(usuario.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este E-mail já está cadastrado.");
        }

        String EncryptedPassword = BCrypt.hashpw(usuario.getPassword(), BCrypt.gensalt());
        usuario.setPassword(EncryptedPassword);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginRequest loginRequest){
        Optional<Usuario> usuarioOp = usuarioRepository.findByEmail(loginRequest.getEmail());

        if(usuarioOp.isPresent()){
            Usuario usuario = usuarioOp.get();

            if(BCrypt.checkpw(loginRequest.getPassword(), usuario.getPassword())){
                return ResponseEntity.ok(usuario);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorreto.");
    }

    @GetMapping
    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long usuarioId, @RequestBody Usuario dadosNovos){
        Optional<Usuario> usuarioOp = usuarioRepository.findById(usuarioId);
        if(!usuarioOp.isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário não encontrado.");
        }

        Usuario usuarioAntigo = usuarioOp.get();
        Optional<?> usuarioComMesmoEmail = usuarioRepository.findByEmail(dadosNovos.getEmail());
        if (usuarioComMesmoEmail.isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este E-mail já está em uso por outra conta");
        }

        usuarioAntigo.setName(dadosNovos.getName());
        usuarioAntigo.setEmail(dadosNovos.getEmail());

        if(dadosNovos.getPassword() != null && !dadosNovos.getPassword().trim().isEmpty()){
            String encrypetdPassword = BCrypt.hashpw(dadosNovos.getPassword(), BCrypt.gensalt());
            usuarioAntigo.setPassword(encrypetdPassword);
        }
        Usuario usuarioAtualizado = usuarioRepository.save(usuarioAntigo);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @PatchMapping("/{usuarioId}/decrementar-vida")
    public ResponseEntity<?> decrementarVida(@PathVariable Long usuarioId){
        Optional<Usuario> usuarioOp = usuarioRepository.findById(usuarioId);
        if(!usuarioOp.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        Usuario usuario = usuarioOp.get();
        int vidasAtual = usuario.getLives();
        if(vidasAtual > 0){
            usuario.setLives(vidasAtual - 1);
            Usuario usuarioAtualizado = usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuarioAtualizado);
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O usuário já está sem vidas");
        }
    }

    @PatchMapping("/{usuarioId}/atualizar-ofensiva")
    public ResponseEntity<?> atualizarOfensiva(@PathVariable Long usuarioId, @RequestParam int quantidade){
        Optional<Usuario> usuarioOp = usuarioRepository.findById(usuarioId);
        if(!usuarioOp.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        Usuario usuario = usuarioOp.get();
        usuario.setDays(usuario.getDays() + quantidade);
        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuarioAtualizado);
    }
}
