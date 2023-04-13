# Camada de Domain
A camada de domain contém as entidades e objetos de valor que representam os conceitos centrais do negócio. É nesta camada que se encontra toda a lógica de negócio e as regras de validação. Essa camada não depende de outras camadas do sistema, permitindo que ela seja facilmente testável e isolada de outras dependências.

Na camada de domain, geralmente são definidos os seguintes elementos:

- **Entidades**: objetos que representam um conceito do negócio e possuem um identificador único.
- **Objetos de Valor**: objetos imutáveis que representam valores que são parte de uma entidade. Exemplos incluem endereços, emails, preços, etc.