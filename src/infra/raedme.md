# Camada de Infraestrutura
A camada de infraestrutura contém as implementações concretas das interfaces definidas na camada de application. É nesta camada que se encontram os adaptadores para bancos de dados, serviços de terceiros, etc.

Na camada de infraestrutura, geralmente são definidos os seguintes elementos:

- **Implementações de Gateways**: implementações concretas das interfaces definidas na camada de application.
- **Repositórios**: implementações concretas das interfaces definidas na camada de application.
- **Adaptadores**: implementações para integração com recursos externos, como bancos de dados, serviços de terceiros, etc.