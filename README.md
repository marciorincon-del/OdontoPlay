# OdontoPlay

Sistema de gestão para clínica odontológica.

## Como rodar

### Backend

```
cd backend
npm install
npm test    # roda os testes
npm start   # sobe a API em http://localhost:3000
```

A API expõe:
- Pacientes em `/api/patients` (GET, POST, GET/PUT/DELETE por `:id`)
- Agendamentos em `/api/appointments` (GET, POST, GET/PUT/DELETE por `:id`)

### Frontend

Com o backend rodando (porta 3000), em outro terminal:

```
cd frontend
npm install
npm run dev   # abre em http://localhost:5173
```

Interface simples com duas abas (Pacientes / Agendamentos), cada uma com lista e formulário de
cadastro, consumindo a API do backend.

## Contribuindo

1. Crie uma branch a partir da `main` com um nome descritivo (ex: `docs/ajuste-x`).
2. Faça suas alterações e commit.
3. Abra um Pull Request explicando o que mudou e por quê.
