# Análise Técnica e Guia de Aprendizado: Fincheck API

Como engenheiro sênior, preparei este guia para ajudar no seu processo de integração e aprendizado desta API. Estas 20 perguntas cobrem os pilares fundamentais da nossa arquitetura e as decisões de design que tomamos.

## Questões para Estudo e Reflexão

### Fundamentos e Estrutura

1. **Estrutura de Pastas:** Como a API está organizada em termos de módulos e por que essa divisão é importante para a escalabilidade do projeto?
   A API utiliza a arquitetura modular nativa do NestJS. Isso é fundamental para a escalabilidade, pois permite o encapsulamento de funcionalidades em módulos independentes, facilitando a injeção de dependências e a manutenção isolada de cada domínio (Users, Auth, Transactions, etc).

2. **NestJS Lifecycle:** Qual o papel dos `Modules`, `Controllers` e `Services` na arquitetura NestJS e como eles se comunicam nesta API?
   - **Modules:** Atuam como containers que organizam e encapsulam componentes relacionados, definindo o que é visível para outros módulos.
   - **Controllers:** São a camada de entrada (Entry Points) que lida com requisições HTTP, delegando a lógica para os services.
   - **Services:** Onde reside a lógica de negócio e as regras da aplicação, servindo de ponte entre o controller e o acesso a dados (Repositories).

3. **Prisma ORM:** Como o `schema.prisma` define o relacionamento entre `User`, `BankAccount` e `Transaction`? Quais são os tipos de relações (1:1, 1:N) presentes?
   O `schema.prisma` utiliza a diretiva `@relation` para mapear chaves estrangeiras. Ex: `user User @relation(fields: [userId], references: [id])`. Relacionamentos presentes:
   - `User` 1:N `BankAccount` / `Category` / `Transaction`.
   - `BankAccount` 1:N `Transaction`.
   - `Category` 1:N `Transaction`.

4. **Variáveis de Ambiente:** Quais informações críticas estão no arquivo `.env` e por que nunca devemos versioná-lo?
   Contém `DATABASE_URL` e `JWT_SECRET`. Nunca devem ser versionadas pois são a "chave do reino": o acesso direto ao banco e a capacidade de assinar tokens falsos, o que comprometeria toda a integridade do sistema.

### Autenticação e Segurança

5. **JWT (JSON Web Token):** Como funciona o fluxo de login nesta API e o que é retornado para o cliente para que ele se mantenha autenticado?
   O fluxo de login valida as credenciais e, em caso de sucesso, emite um `access_token` assinado com a `JWT_SECRET`. O cliente armazena este token e o envia no header `Authorization: Bearer <token>` para autenticar requisições subsequentes.

6. **Guards:** O que o `AuthGuard` faz em cada requisição e como ele decide se um usuário pode ou não acessar uma rota?
   O `AuthGuard` é um Guard Global (via `APP_GUARD`). Ele utiliza o `Reflector` para verificar se a rota possui o metadado `@Public()`. Se for privada, valida o JWT e injeta o `userId` (obtido do campo `sub` do payload) no objeto `request`, garantindo que os dados do usuário estejam disponíveis para as camadas seguintes.

7. **Decorators Customizados:** Para que serve o decorator `@Public()` e como ele altera o comportamento do `AuthGuard`?
   O `@Public()` define rotas que não exigem autenticação. O `AuthGuard` verifica este metadado antes de qualquer validação de token, permitindo o acesso direto caso ele esteja presente.

8. **Extração de Usuário:** Como o decorator `@ActiveUserId()` obtém o ID do usuário autenticado e qual a vantagem de usá-lo em vez de acessar o `request` diretamente no controller?
   O `@ActiveUserId()` centraliza o acesso ao `request['userId']`. A vantagem é a padronização e o fail-fast: se o ID não existir por falha de configuração do Guard, o decorator pode lançar uma exceção antes mesmo de entrar na lógica do controller.

9. **Hashing de Senha:** Qual biblioteca estamos usando para salvar as senhas no banco de dados e por que não devemos salvar senhas em texto puro?
   Utilizamos o `bcrypt` com um fator de custo (salts). Nunca salvamos em texto puro para que, em caso de vazamento da base de dados, as senhas originais dos usuários permaneçam protegidas por criptografia de via única.

### Camada de Dados (Persistência)

10. **Repository Pattern:** Por que criamos a pasta `src/shared/database/repositories` em vez de chamar o Prisma diretamente nos Services?
    Criamos os repositórios como wrappers do Prisma para isolar a infraestrutura de banco de dados. Isso facilita testes unitários (mocking) e permite trocar o ORM ou o banco no futuro sem precisar alterar a lógica de negócio nos Services.

11. **Migrações:** Qual o comando do Prisma você usaria para atualizar o banco de dados após alterar o `schema.prisma`?
    `npx prisma migrate dev` para desenvolvimento (gera o arquivo SQL e aplica as mudanças) e `npx prisma migrate deploy` para ambientes de produção.

12. **Enums:** No banco de dados, o que são os tipos `BankAccountType` e `TransactionType` e como eles ajudam na consistência dos dados?
    São tipos restritos (ex: `INCOME` | `EXPENSE`). Eles garantem a integridade dos dados impedindo valores inválidos no banco e fornecem tipagem forte no código TypeScript.

### Lógica de Negócio e Validação

13. **DTOs (Data Transfer Objects):** Qual a finalidade dos arquivos na pasta `dto` de cada módulo e como eles trabalham junto com o `class-validator`?
    Definem o "contrato" de entrada de dados. Junto com o `class-validator` e o `ValidationPipe` global, garantem que os dados cheguem à aplicação validados, sanitizados e com os tipos corretos (ex: `@IsString`, `@IsNumber`).

14. **Validação de UUID:** Por que usamos o `ParseUUIDPipe` nos parâmetros das rotas (ex: `:bankAccountId`)?
    O `ParseUUIDPipe` valida se os IDs passados na URL seguem o padrão UUID v4. Isso evita erros de query no banco de dados e ataques de injeção de dados malformados.

15. **Ownership (Propriedade):** Por que é necessário um serviço como o `ValidateBankAccountOwnershipService`? O que aconteceria se não validássemos isso em uma rota de `UPDATE` ou `DELETE`?
    Essencial para evitar IDOR (Insecure Direct Object Reference). Sem a validação de propriedade, um usuário autenticado poderia manipular dados de outro usuário apenas adivinhando ou trocando o ID na URL.

16. **Tratamento de Erros:** Como a API lida com erros (ex: quando um registro não é encontrado) para retornar o status HTTP correto ao cliente?
    O NestJS utiliza filtros de exceção. Usamos `NotFoundException`, `UnauthorizedException`, etc., que são automaticamente capturados e transformados em respostas JSON padronizadas com o status HTTP correto.

### Operações e Fluxo

17. **Transações Financeiras:** Ao criar uma `Transaction`, como garantimos que ela esteja vinculada corretamente a uma `Category` e a um `BankAccount` do mesmo usuário?
    Garantimos a integridade cruzando o `userId` do token com o registro no banco. Os serviços de ownership fazem um `findFirst` ou `count` que inclui obrigatoriamente o `userId` na cláusula `where`, impedindo o vínculo com categorias ou contas de terceiros.

18. **Delete Cascade:** O que acontece com as transações de um usuário se ele deletar sua conta? Onde isso está configurado no Prisma?
    Configurado no Prisma com `onDelete: Cascade`. Quando um `User` ou `BankAccount` é removido, o banco de dados deleta automaticamente todas as `Transactions` vinculadas, mantendo a integridade referencial.

19. **Filtros e Queries:** No módulo de `transactions`, como é feita a filtragem por mês, ano ou tipo de transação?
    Utilizamos Query Params via `@Query()`. A lógica de datas usa `gte` (Greater Than or Equal) para o início do período e `lt` (Less Than) para o fim, garantindo que o filtro seja dinâmico e preciso, independentemente da quantidade de dias no mês.

20. **Scripts:** Quais são os principais comandos definidos no `package.json` para rodar a aplicação em desenvolvimento e para executar os testes?
    - `npm run build`: Compila o TS para JS na pasta `/dist`.
    - `npm run start:dev`: Modo desenvolvimento com hot-reload.
    - `npm test`: Executa os testes unitários via Jest.

---

> [!TIP]
> Para responder a estas perguntas, recomendo que você explore o código começando pelo `main.ts`, siga para o `app.module.ts` e depois mergulhe nos módulos específicos. Use a documentação oficial do [NestJS](https://docs.nestjs.com/) e do [Prisma](https://www.prisma.io/docs) como suporte.
