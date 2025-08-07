# Gerador de Etiquetas - Iron Mountain

Uma aplicação web simples e eficiente para gerar sequências de etiquetas de processos com pré-visualização e suporte à impressão em formato ZPL.

![Pré-visualização da Aplicação](/public/preview.png)


---

## ✨ Funcionalidades

- **Geração Sequencial:** Crie múltiplas etiquetas a partir de um ID de pacote e uma quantidade.
- **Pré-visualização Instantânea:** Veja uma representação visual de cada etiqueta, incluindo o código de barras, antes de imprimir.
- **Impressão Flexível:** Imprima uma única etiqueta individualmente ou todas de uma vez.
- **Suporte a ZPL:** A impressão gera um texto formatado em ZPL, ideal para impressoras térmicas profissionais (como Zebra).
- **Interface Limpa:** Layout responsivo e funcional com um cabeçalho fixo e botões de ação claros.
- **Limpeza Rápida:** Um botão para limpar os campos de entrada e os resultados com um único clique.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

- **[Vite](https://vitejs.dev/):** Ferramenta de build e servidor de desenvolvimento extremamente rápido.
- **[React](https://react.dev/):** Biblioteca para construir a interface do usuário.
- **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS utility-first para estilização rápida.
- **[JsBarcode](https://github.com/lindell/JsBarcode):** Usado para gerar a imagem do código de barras na pré-visualização.

---

## 🔧 Como Rodar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

### **Pré-requisitos**

- Você precisa ter o [Node.js](https://nodejs.org/en) (versão 18 ou superior) instalado.
- Um gerenciador de pacotes como `npm` ou `yarn`.

### **Instalação**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra seu navegador e acesse `http://localhost:5173` (ou a porta que o Vite indicar no terminal).

---

## 📋 Como Usar

1.  **Insira os Dados:** Preencha o campo "Nº da Etiqueta do Pacote" e defina a "Quantidade" de processos.
2.  **Gere a Pré-visualização:** Clique no botão "Gerar". Os cards com as pré-visualizações de cada etiqueta aparecerão na tela.
3.  **Imprima:**
    - Para imprimir uma etiqueta específica, clique no botão "Imprimir esta" dentro do card correspondente.
    - Para imprimir todas as etiquetas da lista, clique no botão "Imprimir Todas".
4.  **Caixa de Diálogo de Impressão:** Ao imprimir, a caixa de diálogo do seu navegador será aberta. **Selecione a sua impressora Zebra** (ou outra compatível com ZPL) como destino. O driver da impressora interpretará o texto enviado como comandos ZPL.
5.  **Limpar:** Use o botão "Limpar" para resetar os campos e a lista de etiquetas geradas.

---

## 📄 Licença

Este projeto está sob a licença MIT.