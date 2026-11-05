# 📖 Glossário Técnico: Inglês Técnico para Engenharia em TypeScript

> *"A linguagem molda o pensamento. No desenvolvimento de software internacional, dominar o vocabulário técnico em inglês é o passaporte para ler código, documentações oficiais e comunicar ideias arquiteturais com clareza cristalina."*

---

## 🗂️ Termos de Arquitetura & Engenharia de Software

### **Payload**
* **Tradução**: Carga útil / Dados transportados.
* **Significado**: O corpo principal de dados transmitido em uma requisição ou evento, excluindo cabeçalhos e metadados de protocolo (ex: o JSON enviado no corpo de um `POST`).

### **Handler**
* **Tradução**: Manipulador / Tratador de evento.
* **Significado**: Uma função ou classe responsável por receber um estímulo (um clique, uma requisição HTTP ou uma mensagem de fila) e disparar a resposta correspondente. Ex: `CreateOrderHandler`, `onClickHandler`.

### **Repository (Repositório)**
* **Tradução**: Repositório de persistência.
* **Significado**: Um padrão arquitetural que encapsula a lógica de acesso a dados (banco de dados, arquivos, APIs externas), simulando uma coleção de objetos em memória para a camada de Domínio.

### **UseCase (Caso de Uso)**
* **Tradução**: Caso de uso / Orquestrador de regra de aplicação.
* **Significado**: Uma classe que representa uma ação específica do usuário ou sistema no negócio (ex: `CreateOrderUseCase`, `AuthenticateUserUseCase`). Orquestra entidades e repositórios sem acoplamento a frameworks.

### **Entity (Entidade)**
* **Tradução**: Entidade de Domínio.
* **Significado**: Um objeto do domínio que possui uma **identidade contínua ao longo do tempo**, mesmo que todos os seus atributos mudem (ex: um `User` com um `id` único).

### **Value Object (Objeto de Valor)**
* **Tradução**: Objeto de valor imutável.
* **Significado**: Um objeto do domínio caracterizado exclusivamente pelos seus atributos, e não por um identificador único. Se dois objetos tiverem os mesmos valores, eles são considerados idênticos (ex: `Money`, `Coordinates`, `EmailAddress`).

### **Invariant (Invariante)**
* **Tradução**: Invariante / Regra inegociável de consistência.
* **Significado**: Uma condição que deve ser verdadeira em todos os momentos válidos de uma entidade de domínio (ex: "o estoque de um produto nunca pode ser menor que zero").

### **DTO (Data Transfer Object)**
* **Tradução**: Objeto de Transferência de Dados.
* **Significado**: Uma estrutura simples de dados (sem métodos de negócio) usada exclusivamente para transportar informações entre subsistemas ou camadas (ex: entre a API e o Caso de Uso).

### **Middleware**
* **Tradução**: Software intermediário de pipeline.
* **Significado**: Uma função executada no meio do fluxo entre a chegada de uma requisição e a resposta final (usada para autenticação, logs, validação de cabeçalhos e tratamento de CORS).

### **Composition Root**
* **Tradução**: Raiz de Composição.
* **Significado**: O ponto de entrada único e isolado da aplicação (geralmente o `main.ts` ou `server.ts`) onde todas as dependências concretas são instanciadas e injetadas nos Casos de Uso.

---

## 🗂️ Termos do Sistema de Tipos do TypeScript

### **Structural Typing (Tipagem Estrutural / Duck Typing)**
* **Significado**: O TypeScript avalia a compatibilidade de tipos com base na **forma e propriedades** do objeto, e não no nome explícito da classe que o instanciou. *"Se anda como um pato e faz quack como um pato, é um pato."*

### **Type Erasure (Apagamento de Tipos)**
* **Significado**: O processo pelo qual o compilador do TypeScript remove todas as anotações de tipo, interfaces e type aliases ao gerar JavaScript puro, resultando em zero sobrecarga no tempo de execução.

### **Type Narrowing (Afunilamento de Tipos)**
* **Significado**: O processo pelo qual o compilador deduz um tipo mais específico para uma variável com base em verificações condicionais de fluxo de controle (`typeof`, `instanceof`, `in`, `is`).

### **Discriminated Union (União Discriminada / Tagged Union)**
* **Significado**: Uma união de múltiplos tipos de objetos que compartilham uma propriedade literal comum (o "discriminador" ou "tag", como `status: "SUCCESS"` vs `status: "ERROR"`), permitindo ao compilador saber com exatidão qual objeto está sendo manipulado dentro de um `switch`.

### **Exhaustiveness Check (Checagem Exaustiva)**
* **Significado**: Uma técnica que utiliza o tipo `never` e uma função auxiliar para garantir que todos os casos possíveis de uma união discriminada tenham sido tratados pelo desenvolvedor.

### **Generics (Tipos Genéricos)**
* **Significado**: Parâmetros de tipo (`<T>`) passados para funções, classes ou interfaces, permitindo criar componentes reutilizáveis que funcionam com diversos tipos sem perder a segurança em tempo de compilação.

### **Const Assertions (`as const`)**
* **Significado**: Um modificador especial do TypeScript que transforma um literal de objeto ou array em uma estrutura profundamente imutável (`readonly`) e estreita seus tipos para valores literais exatos.

### **Utility Types (`Partial`, `Pick`, `Omit`, `Record`)**
* **Significado**: Tipos pré-construídos na biblioteca padrão do TypeScript que executam transformações em tipos existentes (ex: `Partial<T>` torna campos opcionais; `Omit<T, K>` remove campos).

---

## 🗂️ Termos de Motion, Animações e Gráficos

### **Keyframe**
* **Tradução**: Quadro-chave.
* **Significado**: Um ponto de ancoragem no tempo que define o estado específico (posição, escala, opacidade) de um elemento visual durante uma animação.

### **Easing (Amortecimento)**
* **Tradução**: Curva de desaceleração/aceleração matemática.
* **Significado**: Uma função matemática que ajusta a velocidade de uma transição ao longo do tempo para simular física realista do mundo real (ex: `easeInQuad`, `easeOutBounce`).

### **LERP (Linear Interpolation)**
* **Tradução**: Interpolação Linear.
* **Significado**: A fórmula matemática básica para calcular um ponto intermediário contínuo entre dois extremos com base em um percentual de tempo normalizado ($0.0$ a $1.0$).

### **Threshold**
* **Tradução**: Limiar / Ponto de corte.
* **Significado**: Um valor de limite a partir do qual um comportamento específico é disparado (ex: volume mínimo de compra para ganhar frete grátis, ou limiar de rolagem de página para disparar animação).

---

## 💡 Dica de Ouro para Estudos

Quando encontrar uma palavra desconhecida em uma biblioteca open-source, anote seu contexto e consulte este glossário. Quanto mais você pensar com esses termos em inglês, mais natural será o desenho da sua arquitetura!

