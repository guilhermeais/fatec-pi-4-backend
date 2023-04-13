# Projeto Integrador
DSM, Fatec Franca
<br/>

**Contribuidores**:
 - [Guilherme Teixeira Ais](https://www.linkedin.com/in/dev-guilherme-ais/);
 - [João Miguel Moscardini](https://www.linkedin.com/in/jo%C3%A3o-miguel-moscardini-24737a222/).

 <br/>

## Projeto
**Nome do projeto**: Solar Limp Pyranometer;
<br/>

**Descrição**: O projeto tem como objetivo medir incidências solares em terrenos e definir o 
melhor lugar para se colocar uma placa solar. 

<br/>

## API NodeJS
Essa API é um serviço que será responsável por cadastrar e gerenciar usuários; gerenciar as incidências solares recebidas pelo dispositivo IOT.

<br/>

Nela, serão aplicados design de software como **Arquitetura Limpa** e princípios como **DDD**, **SOLID**. 
Junto a isso, tentaremos aplicar testes automatizados, principalmente utilizando BDD utilizando **Cucumber** e a linguagem comum **Gherkin**, para que tenhamos tanto uma documentação de código como um teste comprovando a funcionalidade dela.

<br/>

### Estrutura de pastas:

```
src
├── domain
│   ├── entities
│   └── value-objects
├── application
│   ├── usecases
│   ├── gateways
│   └── repositories
├── infra
└── main
tests
```