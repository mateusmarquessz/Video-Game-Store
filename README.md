# 🎮 Video Game Store

Bem-vindo ao **Video Game Store**, um sistema de loja de jogos online desenvolvido para gerenciar usuários, jogos e suas interações. O projeto é composto por um backend em **Java** com **Spring Boot** e um frontend em **React**.

---

## 🛠 Funcionalidades

### **Backend (Java + Spring Boot)**
- **Gerenciamento de Usuários**:
  - 📜 Criação de usuários com informações como nome, email, senha e imagem de perfil.
  - ✏️ Edição e exclusão de usuários.
  - 🔒 Autenticação baseada em **JWT (JSON Web Tokens)**.
  - 💼 Definição de **roles** para usuários e administradores, permitindo que os administradores gerenciem a plataforma, enquanto os usuários podem interagir com os jogos.

- **Gerenciamento de Jogos**:
  - ➕ Adicionar e listar jogos na plataforma, com um **gestor padrão** responsável pela inserção de novos jogos.
  - 🛒 Adicionar e remover jogos do **carrinho de compras**.
  - 💖 Adicionar e remover jogos dos **favoritos**.
  - 💸 Adquirir jogos que vao para a lista de **jogos comprados**.

### **Frontend (React)**
- **Interface de Usuário**:
  - 📝 Cadastro e login de usuários com gerenciamento de autenticação e roles.
  - 🛍️ Visualização e manipulação do **carrinho de compras** e **jogos favoritos**.
  - 👤 Exibição de dados do **perfil de usuário** com a possibilidade de editar a foto de perfil, nome, apelido e biografia.
  - 📦 Exibição de **jogos adquiridos** e **jogos favoritos** diretamente na página do perfil.

- **Gerenciamento de Estado**:
  - Utilização de **Context API** e **Hooks** (`useContext`, `useState`) para gerenciamento de estado global.
  - **Axios** para requisições HTTP ao backend.

---

## 🚀 Tecnologias Utilizadas

### **Backend**
- **Java**: Linguagem de programação principal.
- **Spring Boot**: Framework para desenvolvimento rápido de aplicativos Java.
- **Spring Data JPA**: Para interações com o banco de dados.
- **MySQL** (ou outro banco de dados relacional): Armazenamento de dados persistentes.
- **JWT**: Para autenticação segura de usuários.

### **Frontend**
- **React**: Biblioteca para construção de interfaces de usuário.
- **Context API e Hooks** (`useContext`, `useState`): Gerenciamento de estado global.
- **Axios**: Para fazer requisições HTTP para o backend.

---
