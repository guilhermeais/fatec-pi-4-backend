# Camada Application
Na Arquitetura limpa, a camada de **application**, é responsável por orquestrar a comunicação do nosso domínio com outras camadas. 
<br/>
Ela utiliza as entidades e métodos definidos nas entidades e casos de usos para executar a lógica de negócio.
<br/>
Essa camada não deve conter código externo, toda dependência externa deve ser invertida utilizando **inversão de dependência**/**injeção de dependência**.
<br/>
Por exemplo, a comunicação com banco de dados devem ser utilizado os **repositories**, e na camada de **infra** esses repositories serão implementados por uma classe concreta.

Na camada de application, geralmente são definidos os seguintes elementos:

- **Casos de Uso**: operações que o usuário pode realizar no sistema.
- **Gateways**: interfaces para serviços externos que são necessários para a execução da lógica de negócio.
- **Repositories**: interfaces para acesso a camada de persistência.